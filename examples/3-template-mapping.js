import { mapJson } from "../../../map-json-by-json/index.js";
import sampleData from "../data/sample.json" with { type: "json" };

console.log("=== Recipe 3: Template-Driven Reshaping (map-json-by-json) ===");

// Target Template is the source of truth, reshaping into a clean contract
const targetTemplate = {
  header: {
    invoice: "INVOICE_NUMBER",
    issuedOn: "DATE",
    client: "CUSTOMER_NAME"
  },
  products: {
    $from: "ALL_INVENTORY_ENTRIES_LIST",
    title: "ITEM_NAME",
    total: "TOTAL_AMOUNT",
    allocations: {
      $from: "BATCH_ALLOCATIONS_LIST",
      lot: "BATCH_NUMBER",
      count: "ALLOCATED_QTY"
    }
  }
};

const transformed = mapJson(targetTemplate, sampleData);
console.log(JSON.stringify(transformed, null, 2));
