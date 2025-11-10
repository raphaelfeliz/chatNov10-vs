
---

## **File: `src/core/engine/deterministFilterNode.ts`**

**Purpose:**
Central orchestrator for the deterministic filtering flow. Runs the main loop and decides what to ask next, or when to finalize.

**Imports:**

* `Product`, `PRODUCT_CATALOG` from `productDatabase.ts`
* `getFacetOrder`, `getFacetLabel` from `facetsNode.ts`
* `applyFacetFilter`, `extractOptionsForFacet` from `filterUtils.ts`
* Deterministic rules from `rulesNode.ts`
* `updateFilterState`, `saveFilteredProducts` from `filterStateNode.ts`
* `debugLog` from `helpers.ts`

**Functions:**

* `calculateNextUiState`: main engine, applies filtering + rules + next question logic.
* `saveFilteredProducts`: saves filtered list globally or to context.
* `autoSelect`: applies automatic selection when only one valid option remains.
* `markFacetSkipped`: marks facets skipped during flow.

**Exports:**

* `calculateNextUiState` (main export).

---

## **File: `src/core/engine/filterUtils.ts`**

**Purpose:**
Low-level filtering logic and utilities for extracting options and handling facet data.

**Imports:**

* `Product` type from `productDatabase.ts`
* `debugLog` from `helpers.ts`

**Functions:**

* `applyFacetFilter`: filters `PRODUCT_CATALOG` using selected facets.
* `extractOptionsForFacet`: lists valid options (label/value/image) for a facet from remaining products.
* `pickNextFacet`: finds the next facet in sequence that still needs a value.

**Exports:**

* `applyFacetFilter`
* `extractOptionsForFacet`
* `pickNextFacet`

---

## **File: `src/core/engine/facetsNode.ts`**

**Purpose:**
Defines all available facets, their deterministic order, and question text.

**Imports:**

* none (static definitions).

**Functions:**

* `getFacetOrder`: returns ordered list of facet keys (`categoria`, `sistema`, etc.).
* `getFacetLabel`: returns localized Portuguese question strings.

**Exports:**

* `getFacetOrder`
* `getFacetLabel`
* `FACET_ORDER` constant (for direct use in other files).

---

## **File: `src/core/engine/rulesNode.ts`**

**Purpose:**
Encapsulates all deterministic rules that control skipping, auto-selection, and flow termination.

**Imports:**

* `Product` type
* Utility functions from `filterUtils.ts`

**Functions:**

* `ruleFinalizeSingleResult`: stops flow when only one product remains.
* `ruleSkipInvalidFacet`: skips a facet when no valid options exist.
* `ruleAutoSelectSingleOption`: automatically fills facets with a single valid option.
* `ruleDependencyCheck`: skips or modifies facets based on dependencies (e.g., `persiana` → `persianaMotorizada`).

**Exports:**

* All four rule functions.

---

## **File: `src/core/engine/filterStateNode.ts`**

**Purpose:**
Maintains transient state of the UI flow — what the next question is, what options to show, and what filtered results exist.

**Imports:**

* `Option` and `FacetKey` types
* `debugLog` from `helpers.ts`

**Functions:**

* `updateFilterState`: updates the current filter question, options, and prompt.
* `clearFilterState`: resets all temporary data when flow finishes or restarts.

**Exports:**

* `updateFilterState`
* `clearFilterState`
* `FilterState` type definition.

---

## **File: `src/core/ui/uiQuestionNode.ts`**

**Purpose:**
Prepares and structures the question UI based on the current filter state.

**Imports:**

* `FilterState` from `filterStateNode.ts`
* `Product` from `productDatabase.ts`

**Functions:**

* `buildQuestionState`: creates the display-ready question text and visual options.
* `finalizeProductState`: builds the UI object for final product display (image, title, link).

**Exports:**

* `buildQuestionState`
* `finalizeProductState`

---

✅ **Summary:**
This modular structure keeps filtering logic (`deterministFilterNode`, `filterUtils`) separate from data (`facetsNode`, `productDatabase`) and presentation (`uiQuestionNode`).
It ensures maintainability — each file focuses on one stage of the deterministic flow: **filter → decide → question → present.**
