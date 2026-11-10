import test from "node:test";
import assert from "node:assert/strict";
import {
  canvasFormats,
  formatFields,
  formatsFor,
  projectSize,
  validRatio,
} from "../src/lib/formats.ts";
import { projectTemplates } from "../src/lib/templates.ts";
import { templateState } from "../src/lib/template-state.ts";
const categories = [
  "video",
  "image",
  "present",
  "printing",
  "photo",
  "document",
  "excel",
  "website",
];
test("each active category has valid, distinct formats and editable templates", () => {
  assert.equal(
    new Set(canvasFormats.map((f) => f.id)).size,
    canvasFormats.length,
  );
  assert.equal(
    new Set(projectTemplates.map((t) => t.id)).size,
    projectTemplates.length,
  );
  for (const mode of categories) {
    assert.ok(formatsFor(mode).length);
    assert.ok(projectTemplates.some((t) => t.mode === mode));
  }
  for (const format of canvasFormats) {
    assert.ok(validRatio(format.ratio));
    assert.ok(format.width > 0 && format.height > 0);
    assert.ok(
      projectTemplates.some((t) => t.formatId === format.id),
      `No template for ${format.id}`,
    );
  }
  for (const template of projectTemplates) {
    assert.ok(categories.includes(template.mode));
    assert.equal(
      canvasFormats.find((f) => f.id === template.formatId)?.mode,
      template.mode,
    );
  }
});
test("platform formats preserve their platform identities even when ratios match", () => {
  const tiktok = formatFields("video-tiktok");
  const reels = formatFields("video-instagram-reel");
  assert.equal(tiktok.ratio, "9:16");
  assert.equal(reels.ratio, "9:16");
  assert.notEqual(tiktok.formatId, reels.formatId);
  assert.deepEqual(projectSize(tiktok), [1080, 1920]);
  assert.deepEqual(projectSize(formatFields("video-youtube")), [1920, 1080]);
  assert.deepEqual(
    projectSize(formatFields("video-facebook-feed")),
    [1080, 1350],
  );
});
test("template creation enforces category, format and independent scene identities", () => {
  assert.throws(() => templateState("doc-resume", "video"), /category/);
  const first = templateState("deck-pitch", "present"),
    second = templateState("deck-pitch", "present");
  assert.equal(first.scenes?.length, 4);
  assert.equal(first.formatId, "slides-wide");
  assert.notEqual(first.scenes?.[0].id, second.scenes?.[0].id);
  assert.notEqual(first.scenes?.[0].title, first.scenes?.[1].title);
  assert.equal(first.templateStyle, "presentation");
});
test("document templates contain editable bodies instead of placeholder artwork", () => {
  assert.match(templateState("doc-resume", "document").script!, /EXPERIENCE/);
  assert.match(templateState("doc-report", "document").script!, /FINDINGS/);
  const affidavit = templateState("doc-affidavit", "document");
  assert.match(affidavit.script!, /\[full legal name\]/);
  assert.match(affidavit.templateNote!, /local/);
  assert.equal(affidavit.formatId, "document-legal");
});
test("spreadsheet templates keep formulas and never share mutable cells", () => {
  const first = templateState("sheet-budget", "excel");
  assert.equal(first.cells?.[6][1], "=SUM(B2:B6)");
  assert.equal(first.cells?.length, 20);
  first.cells![1][0] = "Changed";
  assert.equal(templateState("sheet-budget", "excel").cells?.[1][0], "Housing");
  assert.ok(first.cells?.every((row) => row.length === 8));
});
test("photo template style and website content are category specific", () => {
  const photo = templateState("photo-border", "photo");
  assert.equal(photo.photoInset, 6);
  assert.equal(photo.title, "");
  assert.equal(photo.formatId, "photo-square");
  const site = templateState("web-mobile", "website");
  assert.match(site.script!, /<main>/);
  assert.ok(site.stylesheet);
  assert.equal(site.width, 390);
  assert.equal(site.height, 844);
});
test("legacy ratios still resolve to sizes and malformed ratios are rejected", () => {
  assert.deepEqual(projectSize({ ratio: "16:9" }), [1920, 1080]);
  assert.deepEqual(projectSize({ ratio: "5:7" }), [1080, 1512]);
  for (const value of ["0:2", "x:y", "9:16; color:red", "999999:1", null])
    assert.equal(validRatio(value), false);
});
