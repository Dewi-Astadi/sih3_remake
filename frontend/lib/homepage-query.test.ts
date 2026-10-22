import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { PosRow } from "./homepage-data.ts";
import {
  buildSortHref,
  buildTableHref,
  DEFAULT_TABLE_QUERY,
  filterRows,
  paginate,
  parseTableQuery,
  sortRows,
  type TableQuery,
} from "./homepage-query.ts";

function makeRow(overrides: Partial<PosRow>): PosRow {
  return {
    id: 1,
    kode_pos: "POS-1",
    nama: "Pos Contoh",
    tipe: "hidrologi",
    jenis: "AWLR",
    jenisKey: "duga-air",
    jenisMeta: null,
    wilayah_sungai: "WS Serayu Opak",
    das: "DAS Progo",
    sub_das: null,
    sungai: "Sungai Progo",
    desa: null,
    kecamatan: null,
    kabupaten: "Sleman",
    provinsi: "D.I. Yogyakarta",
    walidata: { id: 1, nama: "BBWS Serayu Opak", singkatan: "BBWS SO" },
    latest: null,
    status: { label: "Normal", tone: "good", alert: false },
    timestamp: { text: null, ageHours: null, ageText: null, stale: false, iso: null },
    ...overrides,
  };
}

describe("parseTableQuery", () => {
  it("falls back to defaults for unknown values", () => {
    const query = parseTableQuery({ tipe: "tidak-ada", sort: "harga", dir: "naik", page: "-3" });
    assert.deepEqual(query, DEFAULT_TABLE_QUERY);
  });

  it("reads valid values and trims the search term", () => {
    const query = parseTableQuery({
      q: "  progo ",
      tipe: "hidrogeologi",
      jenis: "muka-air-tanah",
      walidata: "3",
      status: "peringatan",
      sort: "status",
      dir: "desc",
      page: "4",
    });
    assert.equal(query.q, "progo");
    assert.equal(query.tipe, "hidrogeologi");
    assert.equal(query.jenis, "muka-air-tanah");
    assert.equal(query.walidata, "3");
    assert.equal(query.status, "peringatan");
    assert.equal(query.sort, "status");
    assert.equal(query.dir, "desc");
    assert.equal(query.page, 4);
  });
});

describe("filterRows", () => {
  const rows = [
    makeRow({ id: 1, nama: "AWLR Kranggan", kabupaten: "Temanggung" }),
    makeRow({
      id: 2,
      nama: "ARR Borobudur",
      tipe: "hidrometeorologi",
      jenis: "ARR",
      jenisKey: "curah-hujan",
      status: { label: "Hujan Lebat", tone: "rain-heavy", alert: true },
      walidata: { id: 2, nama: "BMKG", singkatan: "BMKG" },
    }),
    makeRow({
      id: 3,
      nama: "MAT Wates",
      tipe: "hidrogeologi",
      jenis: "MAT",
      jenisKey: "muka-air-tanah",
      status: { label: "—", tone: "neutral", alert: false },
      walidata: null,
    }),
  ];

  it("filters by field, pos type and agency", () => {
    assert.equal(filterRows(rows, { ...DEFAULT_TABLE_QUERY, tipe: "hidrogeologi" }).length, 1);
    assert.equal(
      filterRows(rows, { ...DEFAULT_TABLE_QUERY, jenis: "curah-hujan" }).length,
      1
    );
    assert.equal(filterRows(rows, { ...DEFAULT_TABLE_QUERY, walidata: "2" }).length, 1);
  });

  it("filters the alert set and exact status labels", () => {
    assert.deepEqual(
      filterRows(rows, { ...DEFAULT_TABLE_QUERY, status: "peringatan" }).map((row) => row.id),
      [2]
    );
    assert.deepEqual(
      filterRows(rows, { ...DEFAULT_TABLE_QUERY, status: "Normal" }).map((row) => row.id),
      [1]
    );
  });

  it("searches name, river, DAS and regency", () => {
    assert.deepEqual(
      filterRows(rows, { ...DEFAULT_TABLE_QUERY, q: "temanggung" }).map((row) => row.id),
      [1]
    );
    assert.deepEqual(
      filterRows(rows, { ...DEFAULT_TABLE_QUERY, q: "das progo" }).map((row) => row.id),
      [1, 2, 3]
    );
  });
});

describe("sortRows", () => {
  const rows = [
    makeRow({
      id: 1,
      nama: "B",
      status: { label: "Normal", tone: "good", alert: false },
      latest: {
        nilai: 1,
        satuan: "m",
        status_siaga: "normal",
        recorded_at: "2026-09-21T00:00:00Z",
        parameter_tambahan: null,
      },
    }),
    makeRow({
      id: 2,
      nama: "A",
      status: { label: "Awas", tone: "danger", alert: true },
      latest: {
        nilai: 2,
        satuan: "m",
        status_siaga: "awas",
        recorded_at: "2026-09-22T00:00:00Z",
        parameter_tambahan: null,
      },
    }),
  ];

  it("sorts by name in both directions", () => {
    assert.deepEqual(sortRows(rows, "nama", "asc").map((row) => row.id), [2, 1]);
    assert.deepEqual(sortRows(rows, "nama", "desc").map((row) => row.id), [1, 2]);
  });

  it("puts alert tones first when sorting by status ascending", () => {
    assert.deepEqual(sortRows(rows, "status", "asc").map((row) => row.id), [2, 1]);
  });

  it("sorts by measurement time and keeps rows without a reading last", () => {
    const withMissing = [...rows, makeRow({ id: 3, nama: "C" })];
    assert.deepEqual(sortRows(withMissing, "waktu", "desc").map((row) => row.id), [2, 1, 3]);
  });
});

describe("buildTableHref", () => {
  it("omits default values and keeps the table anchor", () => {
    assert.equal(buildTableHref(DEFAULT_TABLE_QUERY), "/#data-terkini");
  });

  it("encodes filters and page", () => {
    const query: TableQuery = { ...DEFAULT_TABLE_QUERY, tipe: "hidrologi", page: 3 };
    assert.equal(buildTableHref(query), "/?tipe=hidrologi&page=3#data-terkini");
  });

  it("flips sort direction only for the active column", () => {
    assert.equal(buildSortHref(DEFAULT_TABLE_QUERY, "nama"), "/?dir=desc#data-terkini");
    assert.equal(buildSortHref(DEFAULT_TABLE_QUERY, "waktu"), "/?sort=waktu#data-terkini");
  });
});

describe("paginate", () => {
  const rows = Array.from({ length: 32 }, (_, index) => makeRow({ id: index + 1 }));

  it("pages by 15 rows and clamps out-of-range pages", () => {
    const first = paginate(rows, 1);
    assert.equal(first.rows.length, 15);
    assert.deepEqual([first.from, first.to, first.lastPage], [1, 15, 3]);

    const last = paginate(rows, 99);
    assert.equal(last.page, 3);
    assert.equal(last.rows.length, 2);
    assert.deepEqual([last.from, last.to], [31, 32]);
  });

  it("handles an empty result", () => {
    const empty = paginate([], 1);
    assert.deepEqual([empty.total, empty.from, empty.to, empty.lastPage], [0, 0, 0, 1]);
  });
});
