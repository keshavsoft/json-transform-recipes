import { renameJsonKeys } from "../../rename-json-keys/index.js";
import sampleData from "../data/sample.json" with { type: "json" };

console.log("=== Recipe 2: Recursive Key Renaming (rename-json-keys) ===");

// Data is the source of truth, keys get converted to clean friendly names
const keyDictionary = {
  DATE: "date",
  INVOICE_NUMBER: "invoiceNo",
  TRANSACTION_TYPE: "type",
  CUSTOMER_NAME: "customer",
  ALL_INVENTORY_ENTRIES_LIST: "items",
  ITEM_NAME: "name",
  QUANTITY: "qty",
  UNIT_PRICE: "rate",
  TOTAL_AMOUNT: "amount",
  BATCH_ALLOCATIONS_LIST: "batches",
  BATCH_NUMBER: "batchNo",
  ALLOCATED_QTY: "allocatedQty"
};

const renamed = renameJsonKeys(sampleData, keyDictionary);
console.log(JSON.stringify(renamed, null, 2));
