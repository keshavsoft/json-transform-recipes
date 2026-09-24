import { selectJson } from "../../select-json-by-json/index.js";
import { renameJsonKeys } from "../../rename-json-keys/index.js";
import sampleData from "../data/sample.json" with { type: "json" };

console.log("=== Recipe 4: The Clean Pipeline (Select -> Rename) ===");

// Step 1: Filter fields using select-json-by-json
const step1 = selectJson(sampleData, {
  INVOICE_NUMBER: true,
  DATE: true,
  ALL_INVENTORY_ENTRIES_LIST: {
    ITEM_NAME: true,
    TOTAL_AMOUNT: true,
    BATCH_ALLOCATIONS_LIST: {
      BATCH_NUMBER: true
    }
  }
});

// Step 2: Normalize key names using rename-json-keys
const step2 = renameJsonKeys(step1, {
  INVOICE_NUMBER: "invoiceNo",
  DATE: "date",
  ALL_INVENTORY_ENTRIES_LIST: "items",
  ITEM_NAME: "name",
  TOTAL_AMOUNT: "amount",
  BATCH_ALLOCATIONS_LIST: "batches",
  BATCH_NUMBER: "batch"
});

console.log("Final Clean Output:");
console.log(JSON.stringify(step2, null, 2));
