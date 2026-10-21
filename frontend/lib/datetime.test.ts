import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { describeTimestamp, formatWibDate, STALE_AFTER_HOURS } from "./datetime.ts";

const NOW = new Date("2026-10-19T04:00:00Z");

describe("describeTimestamp", () => {
  it("formats in WIB with the year, matching the PRD example", () => {
    const info = describeTimestamp("2026-09-21T18:00:00.000000Z", NOW);
    assert.equal(info.text, "22 Sep 2026, 01.00 WIB");
    assert.equal(info.iso, "2026-09-21T18:00:00.000Z");
  });

  it("converts UTC across the date boundary", () => {
    const info = describeTimestamp("2026-09-21T17:59:00Z", NOW);
    assert.equal(info.text, "22 Sep 2026, 00.59 WIB");
  });

  it("flags data older than the staleness threshold", () => {
    const fresh = describeTimestamp("2026-10-18T22:30:00Z", NOW); // 5.5 hours
    assert.equal(fresh.stale, false);

    const stale = describeTimestamp("2026-10-18T21:30:00Z", NOW); // 6.5 hours
    assert.equal(stale.stale, true);
    assert.equal(stale.ageHours, 6);
  });

  it("uses the documented default threshold", () => {
    assert.equal(STALE_AFTER_HOURS, 6);
    const exactly = describeTimestamp("2026-10-18T22:00:00Z", NOW);
    assert.equal(exactly.stale, false);
  });

  it("builds Indonesian relative age text", () => {
    assert.equal(describeTimestamp("2026-10-18T22:00:00Z", NOW).ageText, "6 jam yang lalu");
    assert.equal(describeTimestamp("2026-10-16T04:00:00Z", NOW).ageText, "3 hari yang lalu");
    assert.equal(describeTimestamp("2026-10-19T03:45:00Z", NOW).ageText, "15 menit yang lalu");
  });

  it("returns nulls for missing or invalid input", () => {
    for (const value of [null, undefined, "", "bukan-tanggal"]) {
      const info = describeTimestamp(value, NOW);
      assert.equal(info.text, null);
      assert.equal(info.stale, false);
      assert.equal(info.ageText, null);
    }
  });
});

describe("formatWibDate", () => {
  it("renders a date without time", () => {
    assert.equal(formatWibDate("2026-09-21T18:00:00Z"), "22 Sep 2026");
  });

  it("returns null for invalid input", () => {
    assert.equal(formatWibDate("x"), null);
  });
});
