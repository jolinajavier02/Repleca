import { accountStorageOwner, readProjects, saveProject } from "./projects";
import type { StudioProject } from "./projects";
export type MediaAsset = {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  size: number;
  created: number;
  updated: number;
  folderId: string | null;
  blob: Blob;
  sourceKey?: string;
};
export type MediaFolder = {
  id: string;
  ownerId: string;
  name: string;
  created: number;
};
let opening: Promise<IDBDatabase> | undefined;
function database() {
  opening ??= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("repleca-media", 1);
    request.onupgradeneeded = () => {
      for (const name of ["files", "folders"]) {
        const store = request.result.createObjectStore(name, { keyPath: "id" });
        store.createIndex("ownerId", "ownerId");
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        opening = undefined;
      };
      resolve(db);
    };
    request.onerror = () => {
      opening = undefined;
      reject(new Error("Your browser could not open file storage."));
    };
  });
  return opening;
}
async function readAll<T>(store: string): Promise<T[]> {
  const owner = accountStorageOwner();
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(store)
      .objectStore(store)
      .index("ownerId")
      .getAll(owner);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Could not read your files."));
  });
}
async function write(store: string, value: MediaAsset | MediaFolder) {
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(
        new Error(
          "Your browser could not save this file. Check available device storage.",
        ),
      );
    tx.onabort = () =>
      reject(new Error("The file could not be saved. Please try again."));
  });
}
export const listMedia = () => readAll<MediaAsset>("files");
export const listFolders = () => readAll<MediaFolder>("folders");
export async function getMedia(id: string) {
  return (await listMedia()).find((asset) => asset.id === id) || null;
}
export async function addMedia(
  file: File,
  folderId: string | null = null,
  sourceKey?: string,
) {
  const ownerId = accountStorageOwner();
  if (
    folderId &&
    !(await listFolders()).some((folder) => folder.id === folderId)
  )
    throw new Error("This folder is no longer available.");
  const asset: MediaAsset = {
    id: sourceKey ? `${ownerId}:${sourceKey}` : crypto.randomUUID(),
    ownerId,
    name: file.name || "Untitled file",
    type: file.type || "application/octet-stream",
    size: file.size,
    created: Date.now(),
    updated: Date.now(),
    folderId,
    blob: file,
    sourceKey,
  };
  await write("files", asset);
  return asset;
}
export async function updateMedia(
  id: string,
  changes: { name?: string; folderId?: string | null; blob?: Blob },
) {
  const asset = await getMedia(id);
  if (!asset) throw new Error("This file is no longer available.");
  if (
    changes.name !== undefined &&
    (!changes.name.trim() || changes.name.trim().length > 160)
  )
    throw new Error("Enter a file name (1–160 characters).");
  if (
    changes.folderId &&
    !(await listFolders()).some((f) => f.id === changes.folderId)
  )
    throw new Error("This folder is no longer available.");
  const next = {
    ...asset,
    ...changes,
    ...(changes.name !== undefined ? { name: changes.name.trim() } : {}),
    ...(changes.blob
      ? { size: changes.blob.size, type: changes.blob.type || asset.type }
      : {}),
    updated: Date.now(),
  };
  await write("files", next);
  return next;
}
export async function copyMedia(id: string) {
  const asset = await getMedia(id);
  if (!asset) throw new Error("This file is no longer available.");
  const dot = asset.name.lastIndexOf(".");
  const name =
    dot > 0
      ? `${asset.name.slice(0, dot)} copy${asset.name.slice(dot)}`
      : `${asset.name} copy`;
  const copy = {
    ...asset,
    id: crypto.randomUUID(),
    name,
    sourceKey: undefined,
    created: Date.now(),
    updated: Date.now(),
  };
  await write("files", copy);
  return copy;
}
export async function deleteMedia(id: string) {
  if (!(await getMedia(id)))
    throw new Error("This file is no longer available.");
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error("Could not delete this file."));
  });
}
export async function createFolder(name: string) {
  const clean = name.trim();
  if (!clean || clean.length > 80)
    throw new Error("Enter a folder name (1–80 characters).");
  if (
    (await listFolders()).some(
      (f) => f.name.toLowerCase() === clean.toLowerCase(),
    )
  )
    throw new Error("A folder with this name already exists.");
  const folder = {
    id: crypto.randomUUID(),
    ownerId: accountStorageOwner(),
    name: clean,
    created: Date.now(),
  };
  await write("folders", folder);
  return folder;
}
export async function renameFolder(id: string, name: string) {
  const folders = await listFolders();
  const folder = folders.find((f) => f.id === id);
  if (!folder) throw new Error("Folder not found.");
  const clean = name.trim();
  if (!clean || clean.length > 80)
    throw new Error("Enter a folder name (1–80 characters).");
  if (
    folders.some(
      (f) => f.id !== id && f.name.toLowerCase() === clean.toLowerCase(),
    )
  )
    throw new Error("A folder with this name already exists.");
  await write("folders", { ...folder, name: clean });
}
export async function removeFolder(id: string) {
  if (!(await listFolders()).some((f) => f.id === id))
    throw new Error("Folder not found.");
  const files = (await listMedia()).filter((f) => f.folderId === id);
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(["files", "folders"], "readwrite");
    files.forEach((file) =>
      tx.objectStore("files").put({ ...file, folderId: null }),
    );
    tx.objectStore("folders").delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(new Error("Could not remove this folder."));
  });
}
export function mediaDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this file."));
    reader.readAsDataURL(blob);
  });
}
export async function portableProject(project: StudioProject) {
  if (!project.media?.assetId) return project;
  const asset = await getMedia(project.media.assetId);
  if (!asset)
    throw new Error(
      "The project’s media file was deleted. Replace it before downloading the project.",
    );
  return {
    ...project,
    media: {
      name: asset.name,
      type: asset.type,
      src: await mediaDataUrl(asset.blob),
    },
  };
}
export async function collectProjectMedia() {
  const owner = accountStorageOwner();
  const existing = await listMedia();
  for (const project of readProjects()) {
    if (accountStorageOwner() !== owner) return;
    if (!project.media?.src.startsWith("data:") || project.media.assetId)
      continue;
    let asset = existing.find(
      (file) => file.sourceKey === `project:${project.id}`,
    );
    if (!asset) {
      const blob = await (await fetch(project.media.src)).blob();
      asset = await addMedia(
        new File([blob], project.media.name, { type: project.media.type }),
        null,
        `project:${project.id}`,
      );
    }
    saveProject({
      ...project,
      media: { name: asset.name, type: asset.type, assetId: asset.id, src: "" },
    });
  }
}
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function fileKind(file: { type: string; name: string }) {
  if (file.type.startsWith("image/")) return "Photos";
  if (file.type.startsWith("video/")) return "Videos";
  if (file.type.startsWith("audio/")) return "Audio";
  if (
    /text|pdf|document|sheet|excel|csv|json/.test(file.type) ||
    /\.(docx?|xlsx?|csv|txt|pdf|html?|md)$/i.test(file.name)
  )
    return "Documents";
  return "Other";
}
