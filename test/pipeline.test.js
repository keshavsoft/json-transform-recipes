import test from "node:test";
import assert from "node:assert/strict";
import { selectJson } from "../../select-json-by-json/index.js";
import { renameJsonKeys } from "../../rename-json-keys/index.js";
import { mapJson } from "../../map-json-by-json/index.js";
import sampleData from "../data/sample.json" with { type: "json" };

test("recipe 1: select-json-by-json filters required fields", () => {
  const selected = selectJson(sampleData, {
    INVOICE_NUMBER: true,
    ALL_INVENTORY_ENTRIES_LIST: {
      ITEM_NAME: true
    }
  });

  assert.equal(selected[0].INVOICE_NUMBER, 1001);
  assert.equal(selected[0].CUSTOMER_NAME, undefined);
  assert.equal(selected[0].ALL_INVENTORY_ENTRIES_LIST.length, 2);
  assert.equal(selected[0].ALL_INVENTORY_ENTRIES_LIST[0].TOTAL_AMOUNT, undefined);
});

test("recipe 2: rename-json-keys normalizes keys recursively", () => {
  const renamed = renameJsonKeys(sampleData, {
    INVOICE_NUMBER: "invoiceNo",
    ALL_INVENTORY_ENTRIES_LIST: "items",
    ITEM_NAME: "name"
  });

  assert.equal(renamed[0].invoiceNo, 1001);
  assert.equal(renamed[0].items[0].name, "Industrial Power Cable");
});

test("recipe 3: map-json-by-json reshapes with target template as truth", () => {
  const template = {
    docId: "INVOICE_NUMBER",
    lines: {
      $from: "ALL_INVENTORY_ENTRIES_LIST",
      title: "ITEM_NAME"
    }
  };

  const mapped = mapJson(template, sampleData);
  assert.equal(mapped[0].docId, 1001);
  assert.equal(mapped[0].lines[0].title, "Industrial Power Cable");
});

test("recipe 4: end-to-end select + rename pipeline produces clean contract", () => {
  const projected = selectJson(sampleData, {
    INVOICE_NUMBER: true,
    ALL_INVENTORY_ENTRIES_LIST: {
      ITEM_NAME: true,
      TOTAL_AMOUNT: true
    }
  });

  const final = renameJsonKeys(projected, {
    INVOICE_NUMBER: "id",
    ALL_INVENTORY_ENTRIES_LIST: "items",
    ITEM_NAME: "item",
    TOTAL_AMOUNT: "price"
  });

  assert.deepEqual(final[0], {
    id: 1001,
    items: [
      { item: "Industrial Power Cable", price: 6000 },
      { item: "Reinforced Fiber Mesh", price: 910 }
    ]
  });
});
