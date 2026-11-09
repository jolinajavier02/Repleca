import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv, csvText, cellDisplay } from "../src/lib/spreadsheet.ts";
test("CSV preserves quoted commas, escaped quotes, and multiline fields", () => {
  const rows = parseCsv(
    'Name,Note\r\n"Ada, L.","She said ""hi""\nthen left"\r\n',
  );
  assert.deepEqual(rows[0].slice(0, 2), ["Name", "Note"]);
  assert.deepEqual(rows[1].slice(0, 2), [
    "Ada, L.",
    'She said "hi"\nthen left',
  ]);
});
test("CSV round trips text and prevents exported text from becoming executable formulas", () => {
  const original = [
    ["normal", "a,b", '"quote"'],
    ["two\nlines", "=RUN()", "@external"],
  ];
  const result = parseCsv(csvText(original));
  assert.deepEqual(result[0].slice(0, 3), original[0]);
  assert.deepEqual(result[1].slice(0, 3), [
    "two\nlines",
    "'=RUN()",
    "'@external",
  ]);
});
test("large or malformed imports fail visibly instead of silently dropping data", () => {
  assert.throws(() => parseCsv(Array(501).fill("row").join("\n")), /500 rows/);
  assert.throws(
    () => parseCsv(Array(51).fill("column").join(",")),
    /50 columns/,
  );
  assert.throws(() => parseCsv('Name\n"unclosed'), /unclosed quoted/);
});
test("empty and ragged CSV stays editable", () => {
  assert.equal(parseCsv("").length, 20);
  const rows = parseCsv("\uFEFFa,b\nc");
  assert.equal(rows[0][0], "a");
  assert.equal(rows[1][1], "");
  assert.equal(rows[1].length, rows[0].length);
});
test("SUM and AVERAGE use numeric cells while leaving text and blanks out", () => {
  const cells = [
    ["2", "text"],
    ["4", ""],
    ["0", "10"],
  ];
  assert.equal(cellDisplay("=SUM(A1:B3)", cells), "16");
  assert.equal(cellDisplay("=AVERAGE(A1:B3)", cells), "4");
  assert.equal(cellDisplay("plain", cells), "plain");
});
test("invalid formulas and out-of-bounds ranges do not execute code", () => {
  const cells = [["1"]];
  assert.equal(cellDisplay("=SUM(A0:A2)", cells), "#REF!");
  assert.equal(cellDisplay("=SUM(Z1:Z1)", cells), "#REF!");
  assert.equal(cellDisplay("=alert(1)", cells), "#FORMULA?");
});
