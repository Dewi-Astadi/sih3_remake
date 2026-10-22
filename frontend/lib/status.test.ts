import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classify,
  classifyCurahHujan,
  classifyKualitasAir,
  STATUS_TANPA_KELAS,
  STATUS_TIDAK_TERSEDIA,
} from "./status.ts";

const kualitasAirCases: Array<[number, string, string, boolean]> = [
  [0, "Baik", "good", false],
  [0.47, "Baik", "good", false],
  [1.0, "Baik", "good", false],
  [1.01, "Cemar Ringan", "watch", false],
  [1.39, "Cemar Ringan", "watch", false],
  [2.37, "Cemar Ringan", "watch", false],
  [5.0, "Cemar Ringan", "watch", false],
  [5.01, "Cemar Sedang", "warning", true],
  [10, "Cemar Sedang", "warning", true],
  [10.01, "Cemar Berat", "danger", true],
];

const curahHujanCases: Array<[number, string, string, boolean]> = [
  [0, "Tidak Hujan", "neutral", false],
  [0.1, "Hujan Sangat Ringan", "rain-light", false],
  [0.5, "Hujan Sangat Ringan", "rain-light", false],
  [1, "Hujan Sangat Ringan", "rain-light", false],
  [1.01, "Hujan Ringan", "rain-light", false],
  [5, "Hujan Ringan", "rain-light", false],
  [5.01, "Hujan Sedang", "rain-moderate", false],
  [10, "Hujan Sedang", "rain-moderate", false],
  [10.01, "Hujan Lebat", "rain-heavy", true],
  [19.9, "Hujan Lebat", "rain-heavy", true],
  [20, "Hujan Sangat Lebat", "rain-heavy", true],
  [75, "Hujan Sangat Lebat", "rain-heavy", true],
];

describe("classifyKualitasAir", () => {
  for (const [pij, label, tone, alert] of kualitasAirCases) {
    it(`PIj ${pij} → ${label}`, () => {
      assert.deepEqual(classifyKualitasAir(pij), { label, tone, alert });
    });
  }

  it("rejects negative and non-finite values", () => {
    assert.deepEqual(classifyKualitasAir(-1), STATUS_TIDAK_TERSEDIA);
    assert.deepEqual(classifyKualitasAir(Number.NaN), STATUS_TIDAK_TERSEDIA);
  });
});

describe("classifyCurahHujan", () => {
  for (const [mm, label, tone, alert] of curahHujanCases) {
    it(`${mm} mm → ${label}`, () => {
      assert.deepEqual(classifyCurahHujan(mm), { label, tone, alert });
    });
  }

  it("rejects negative values", () => {
    assert.deepEqual(classifyCurahHujan(-0.1), STATUS_TIDAK_TERSEDIA);
  });
});

describe("classify", () => {
  it("uses PIj, never pH, as the Kualitas Air headline", () => {
    // pH 6.6 is stored as a secondary parameter; the headline value is PIj 2.37.
    assert.deepEqual(classify("Kualitas Air", 2.37), {
      label: "Cemar Ringan",
      tone: "watch",
      alert: false,
    });
  });

  it("classifies ARR from the value, ignoring the API status_siaga", () => {
    assert.deepEqual(classify("ARR", 34.5, { status: "normal" }), {
      label: "Hujan Sangat Lebat",
      tone: "rain-heavy",
      alert: true,
    });
  });

  it("maps Duga Air statuses to tones", () => {
    assert.deepEqual(classify("AWLR", 2.34, { status: "normal" }), {
      label: "Normal",
      tone: "good",
      alert: false,
    });
    assert.deepEqual(classify("AWLR", 2.34, { status: "Waspada" }), {
      label: "Waspada",
      tone: "watch",
      alert: true,
    });
    assert.deepEqual(classify("AWLR", 3.1, { status: "siaga" }), {
      label: "Siaga",
      tone: "warning",
      alert: true,
    });
    assert.deepEqual(classify("AWLR", 4.2, { status: "awas" }), {
      label: "Awas",
      tone: "danger",
      alert: true,
    });
  });

  it("never invents a Duga Air status", () => {
    assert.deepEqual(classify("AWLR", 2.34), STATUS_TIDAK_TERSEDIA);
    assert.deepEqual(classify("AWLR", 2.34, { status: null }), STATUS_TIDAK_TERSEDIA);
    assert.deepEqual(classify("AWLR", 2.34, { status: "luar-biasa" }), STATUS_TIDAK_TERSEDIA);
  });

  it("gives Klimatologi and Muka Air Tanah no status class", () => {
    assert.deepEqual(classify("Klimatologi", 28.2, { status: "waspada" }), STATUS_TANPA_KELAS);
    assert.deepEqual(classify("MAT", 4.73, { status: "waspada" }), STATUS_TANPA_KELAS);
    assert.deepEqual(classify("AGWLR", 4.73), STATUS_TANPA_KELAS);
  });

  it("reports missing values instead of guessing", () => {
    assert.deepEqual(classify("Kualitas Air", null), STATUS_TIDAK_TERSEDIA);
    assert.deepEqual(classify("ARR", undefined), STATUS_TIDAK_TERSEDIA);
  });

  it("handles unknown pos types", () => {
    assert.deepEqual(classify("Tidak Dikenal", 1), STATUS_TANPA_KELAS);
    assert.deepEqual(classify(null, 1), STATUS_TANPA_KELAS);
  });
});
