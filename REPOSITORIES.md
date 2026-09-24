# Ecosystem Repositories & Architecture Guide

> Comprehensive index of the modular, zero-dependency micro-engines powering the JSON transformation and presentation pipeline.

---

## The Core Philosophy: Focused Micro-Engines

Enterprise systems, legacy backends, SOAP services, and raw XML-to-JSON parsers typically emit verbose, deeply nested, and non-standard JSON payloads. Instead of building monolithic transformation frameworks or writing imperative procedural loops, this suite splits the transformation lifecycle into **focused, single-responsibility micro-engines**.

Each micro-engine:
- Has **zero external dependencies**.
- Runs identically in **Node.js, edge runtimes, and directly inside modern browsers via CDN**.
- Adheres to a strict **Source of Truth** contract.

---

## 1. `select-json-by-json` (Data Projection)

[![GitHub](https://img.shields.io/badge/GitHub-select--json--by--json-blue?logo=github)](https://github.com/keshavsoft/select-json-by-json)
[![Live Docs](https://img.shields.io/badge/Docs-Live%20Playground-emerald)](https://keshavsoft.github.io/select-json-by-json/)

### What It Does
`select-json-by-json` is a high-performance JSON projection engine. Given a bulky JSON object or array of objects, it recursively prunes away every property that is not explicitly requested in a projection specification object (`{ fieldName: true }`).

### The Mental Model: Input Data is Truth
The input data dictates the structure. The engine traverses the incoming data tree; if a field matches a rule in the specification, it is copied over into the result. If a field contains an array of objects, the projection rule is recursively applied to each item in that array. Unmatched fields are completely omitted, significantly reducing memory footprint and network payload size.

### Quick Example
```javascript
import { selectJson } from "select-json-by-json";

const projected = selectJson(rawData, {
  INVOICE_NUMBER: true,
  DATE: true,
  ALL_INVENTORY_ENTRIES_LIST: {
    ITEM_NAME: true,
    TOTAL_AMOUNT: true
  }
});
```

---

## 2. `rename-json-keys` (Key Normalization)

[![GitHub](https://img.shields.io/badge/GitHub-rename--json--keys-blue?logo=github)](https://github.com/keshavsoft/rename-json-keys)
[![Live Docs](https://img.shields.io/badge/Docs-Live%20Playground-emerald)](https://keshavsoft.github.io/rename-json-keys/)

### What It Does
`rename-json-keys` recursively normalizes property names across nested objects and arrays. It converts ugly uppercase, legacy, or dot-notated keys (such as `TRANSACTION_DATE` or `ALL_INVENTORY_ENTRIES_LIST`) into clean, idiomatic JavaScript camelCase or domain keys (such as `date` and `items`).

### The Mental Model: Recursive Dictionary Replacement
The input data remains the source of truth for all values and hierarchy. The mapping dictionary defines replacement rules. `rename-json-keys` supports:
1. **Global key replacement**: Any key matching a string rule is renamed anywhere it appears in the tree.
2. **Scoped `$as` rules**: Allows renaming a parent key while scoping child key rules to that specific sub-tree.

### Quick Example
```javascript
import { renameJsonKeys } from "rename-json-keys";

const clean = renameJsonKeys(projectedData, {
  INVOICE_NUMBER: "invoiceNo",
  DATE: "date",
  ALL_INVENTORY_ENTRIES_LIST: "items",
  ITEM_NAME: "name",
  TOTAL_AMOUNT: "amount"
});
```

---

## 3. `map-json-by-json` (Template-Driven Contract Mapping)

[![GitHub](https://img.shields.io/badge/GitHub-map--json--by--json-blue?logo=github)](https://github.com/keshavsoft/map-json-by-json)
[![Live Docs](https://img.shields.io/badge/Docs-Live%20Playground-emerald)](https://keshavsoft.github.io/map-json-by-json/)

### What It Does
`map-json-by-json` reshapes source JSON into a brand-new schema contract. Unlike projection or renaming, you do not modify the original object shape—you define the **exact target template** you need, and the engine pulls values from the source into your template.

### The Mental Model: Target Template is Truth
The target template defines the final structure. Capabilities include:
- **Dot-Notation Path Extraction**: Pull values from arbitrary depths (e.g. `client: "header.customer.info.name"`).
- **Sub-Collection Extraction (`$from`)**: Map arrays of child entities into clean sub-arrays with custom child templates.
- **Static Values (`$value`)**: Inject constants or metadata directly into the output.

### Quick Example
```javascript
import { mapJson } from "map-json-by-json";

const template = {
  invoice: "INVOICE_NUMBER",
  date: "TRANSACTION_DATE",
  client: "CUSTOMER_NAME",
  lineItems: {
    $from: "ALL_INVENTORY_ENTRIES_LIST",
    product: "ITEM_NAME",
    subtotal: "TOTAL_AMOUNT"
  }
};

const transformed = mapJson(template, rawData);
```

---

## 4. `json-to-tag-table` (Visual Drilldown Table)

[![GitHub](https://img.shields.io/badge/GitHub-json--to--tag--table-blue?logo=github)](https://github.com/keshavsoft/json-to-tag-table)

### What It Does
`json-to-tag-table` is an interactive web table renderer designed specifically for complex hierarchical JSON structures. Instead of rendering raw JSON strings or breaking when encountering nested child arrays, it generates clean HTML tables with expand/collapse drilldowns for child records.

### The Mental Model: Declarative DOM Presentation
Given an array of normalized JSON records, `json-to-tag-table` dynamically detects columns, scalar attributes, and nested sub-collections. Sub-collections are rendered with interactive drilldown triggers that allow users to inspect child entities (such as lot allocations or item batches) in place or within modal dialogs.

### Quick Example
```javascript
import { Table } from "https://cdn.jsdelivr.net/gh/keshavsoft/json-to-tag-table@main/docs/dist/v6/min.js";

const table = new Table({
  theme: "default",
  data: normalizedRecords
});

table.methods.render({
  targetHtmlId: "tableContainer",
  inSkeletonType: "tableSimple"
});
```

---

## 5. `json-to-tag` (Declarative DOM Compiler)

[![GitHub](https://img.shields.io/badge/GitHub-json--to--tag-blue?logo=github)](https://github.com/keshavsoft/json-to-tag)
[![Live Docs](https://img.shields.io/badge/Docs-Catalog%20%26%20Tools-emerald)](https://keshavsoft.github.io/json-to-tag/)

### What It Does
`json-to-tag` is a zero-dependency JSON-to-DOM compiler. It takes pure, serializable JSON specifications and compiles them into real browser DOM elements according to a strict catalog of HTML tag schemas (`tags.json`).

### The Mental Model: Tag Catalog Enforcement
It provides automated validation of permitted HTML tags, allowed attributes, and child nesting rules, enabling declarative UI construction from backend-driven JSON specifications.

---

## 6. `json-transform-recipes` (Cookbook & Interactive Showcase)

[![GitHub](https://img.shields.io/badge/GitHub-json--transform--recipes-blue?logo=github)](https://github.com/keshavsoft/json-transform-recipes)
[![Live Workbench](https://img.shields.io/badge/Workbench-Live%20Demo-emerald)](https://keshavsoft.github.io/json-transform-recipes/)

### What It Does
The master showcase, documentation cookbook, and browser-first workbench. It unites all micro-engines into a live, runnable pipeline demonstrating sub-millisecond transformation and visual rendering directly in the browser using official CDNs.

---

## Summary Matrix

| Repository | Responsibility | Mental Model | Official GitHub Repository |
| :--- | :--- | :--- | :--- |
| **`select-json-by-json`** | Field Filtering | Input Data is Truth | [github.com/keshavsoft/select-json-by-json](https://github.com/keshavsoft/select-json-by-json) |
| **`rename-json-keys`** | Key Normalization | Input Data is Truth | [github.com/keshavsoft/rename-json-keys](https://github.com/keshavsoft/rename-json-keys) |
| **`map-json-by-json`** | Contract Reshaping | Target Template is Truth | [github.com/keshavsoft/map-json-by-json](https://github.com/keshavsoft/map-json-by-json) |
| **`json-to-tag-table`** | Table Drilldown UI | Structured Table Generation | [github.com/keshavsoft/json-to-tag-table](https://github.com/keshavsoft/json-to-tag-table) |
| **`json-to-tag`** | Declarative DOM Compiler | Strict Tag Schema | [github.com/keshavsoft/json-to-tag](https://github.com/keshavsoft/json-to-tag) |
| **`json-transform-recipes`** | Pipeline Cookbook | End-to-End Orchestration | [github.com/keshavsoft/json-transform-recipes](https://github.com/keshavsoft/json-transform-recipes) |

---

## License

All packages in this ecosystem are released under the [MIT License](LICENSE) &copy; KeshavSoft.
