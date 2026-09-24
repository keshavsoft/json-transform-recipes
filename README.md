# JSON Transformation Recipes

> End-to-end recipes for XML parsing, JSON field selection, key renaming, template-driven contract mapping, and interactive table rendering.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## The Vision: A Declarative Data Pipeline

Enterprise systems, legacy ERPs, SOAP services, and raw XML backends emit bulky, deeply nested datasets with uppercase, verbose property names.

Instead of writing imperative spaghetti loops to clean, pluck, and reshape data for every view or API endpoint, this suite provides **three declarative micro-engines**:

```
[ Raw Enterprise XML / JSON ]
             │
             ▼
   select-json-by-json     --> Step 1: Filter fields (1:1 projection)
             │
             ▼
    rename-json-keys       --> Step 2: Normalize keys (Data is source of truth)
             │
             ▼
    map-json-by-json       --> Step 3: Reshape into contract (Template is source of truth)
             │
             ▼
    json-to-tag-table      --> Step 4: Render interactive drilldown web tables
```

---

## Micro-Engine Breakdown

| Package | Mental Model | Source of Truth | Primary Purpose | Docs & Demos |
| :--- | :--- | :--- | :--- | :--- |
| **[`select-json-by-json`](https://github.com/keshavsoft/select-json-by-json)** | **Data Projection** | Input Data | Pluck only the fields you need; preserve original shape and keys. | [Interactive Docs](https://keshavsoft.github.io/select-json-by-json/) |
| **[`rename-json-keys`](https://github.com/keshavsoft/rename-json-keys)** | **Key Normalization** | Input Data | Recursively rename ugly keys (`INVENTORY_LIST` $\rightarrow$ `items`) across the entire tree. | [Interactive Docs](https://keshavsoft.github.io/rename-json-keys/) |
| **[`map-json-by-json`](https://github.com/keshavsoft/map-json-by-json)** | **Contract Transformation** | Target Template | You define the exact target output shape; data is extracted into it. | [Interactive Docs](https://keshavsoft.github.io/map-json-by-json/) |
| **[`json-to-tag-table`](https://github.com/keshavsoft/json-to-tag-table)** | **Visual Rendering** | Structured Data | Render interactive HTML drilldown tables for deep nested structures. | [GitHub Repo](https://github.com/keshavsoft/json-to-tag-table) |

---

## Recipes

### Recipe 1: Pure Field Projection (`select-json-by-json`)

```javascript
import { selectJson } from "select-json-by-json";

const selected = selectJson(rawData, {
  INVOICE_NUMBER: true,
  DATE: true,
  ALL_INVENTORY_ENTRIES_LIST: {
    ITEM_NAME: true,
    TOTAL_AMOUNT: true
  }
});
```

---

### Recipe 2: Recursive Key Renaming (`rename-json-keys`)

```javascript
import { renameJsonKeys } from "rename-json-keys";

const clean = renameJsonKeys(data, {
  INVOICE_NUMBER: "invoiceNo",
  DATE: "date",
  ALL_INVENTORY_ENTRIES_LIST: "items",
  ITEM_NAME: "name",
  TOTAL_AMOUNT: "amount"
});
```

---

### Recipe 3: Target Template Mapping (`map-json-by-json`)

```javascript
import { mapJson } from "map-json-by-json";

const template = {
  header: {
    invoice: "INVOICE_NUMBER",
    issuedOn: "DATE"
  },
  items: {
    $from: "ALL_INVENTORY_ENTRIES_LIST",
    name: "ITEM_NAME",
    subtotal: "TOTAL_AMOUNT"
  }
};

const transformed = mapJson(template, rawData);
```

---

### Recipe 4: The Combined Production Pipeline

```javascript
import { selectJson } from "select-json-by-json";
import { renameJsonKeys } from "rename-json-keys";

// 1. Pluck only needed fields
const step1 = selectJson(rawData, {
  INVOICE_NUMBER: true,
  DATE: true,
  ALL_INVENTORY_ENTRIES_LIST: {
    ITEM_NAME: true,
    TOTAL_AMOUNT: true
  }
});

// 2. Normalize to clean camelCase keys
const productionJson = renameJsonKeys(step1, {
  INVOICE_NUMBER: "id",
  DATE: "date",
  ALL_INVENTORY_ENTRIES_LIST: "items",
  ITEM_NAME: "item",
  TOTAL_AMOUNT: "price"
});
```

---

## Interactive Showcase

To explore the interactive web playground:
1. Open `index.html` directly in your browser.
2. Or run:
   ```bash
   npx serve .
   ```

---

## License

[MIT](LICENSE) © [KeshavSoft](https://keshavsoft.com)
