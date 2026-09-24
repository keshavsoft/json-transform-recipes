import { selectJson } from "../../select-json-by-json/index.js";
import sampleData from "../data/sample.json" with { type: "json" };

console.log("=== Recipe 1: Pure Field Selection (select-json-by-json) ===");

// We only need Date, Invoice Number, and Item Details
const projectionSpec = {
  DATE: true,
  INVOICE_NUMBER: true,
  ALL_INVENTORY_ENTRIES_LIST: {
    ITEM_NAME: true,
    TOTAL_AMOUNT: true,
    BATCH_ALLOCATIONS_LIST: {
      BATCH_NUMBER: true
    }
  }
};

const selected = selectJson(sampleData, projectionSpec);
console.log(JSON.stringify(selected, null, 2));
