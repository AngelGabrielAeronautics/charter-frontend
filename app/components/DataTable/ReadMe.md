# DataTable Component

## Aliases and Nicknames

- Rolls Royce Table
- Advanced Data Table

## Purpose

The `DataTable` component is a dynamic, reusable table with support for creating, updating, and viewing records. It automatically infers columns and form fields from the data passed to it.

## Folder Structure

```
/DataTable
  /index.tsx          # Entry point for the DataTable component
  /utilities.ts       # Helper functions like formatLabel, getSingularTitle, etc.
  /Drawers.tsx        # Contains the logic for Create and Edit drawers
  /renderers.tsx      # Contains logic for rendering form fields and table columns
  /ReadMe.md          # Documentation for the component
```

## Key Features

- **Dynamic Table Columns**: Automatically generated based on the keys of the data provided.
- **Editable Drawer**: For creating and editing records via a form that adapts based on data types (e.g., currency, dates, booleans).
- **Formatted Values**: Automatically formats currency, dates, and booleans.
- **Field Mappings**: Allows for context-specific dropdowns if needed, and configurable mappings for specific fields.

## Utilities

- **getSingularTitle(title: string)**: Converts a plural title (e.g., "Flights") to singular (e.g., "Flight").

- **formatLabel(label: string)** Formats camelCase and underscore-separated labels into readable titles.

- **formatCurrency(value: number)** Formats a number into a currency string.

- **isDateKey(key: string), isTimeKey(key: string), isCurrencyKey(key: string)** Helpers to identify key types for rendering appropriate input fields.

## Advanced Features

- **Custom Mappings**: Extend the table to support custom field mappings for dropdowns or select fields with external reference data.

- **View Nested Objects**: Handles nested object values in the table, displaying them via buttons to open a detailed drawer.

## Key Takeaways

- **Flexibility**: The table is designed to handle different types of data dynamically, making it reusable across contexts like `Orders`, `Flights`, `Operators`, etc.
- **Modular Structure**: By splitting the code into `utilities.ts`, `Drawers.tsx`, and `renderers.tsx`, we keep the code clean and maintainable.
- **Extensibility**: The component can be easily extended to handle more complex cases like nested dropdowns and contextual field mappings for forms.
- **User-Friendly**: The `ReadMe.md` provides clear instructions for usage, making the component easy for others to implement and extend.

## How to Use

1. Pass your data, title, and thunks for creating and updating records.
2. The table automatically generates columns based on the data keys.
3. Clicking the "Create" or "Edit" button will open a form in a drawer.

## Props

- **`data`** (Array): Array of data objects for the table.
- **`title`** (String): Title of the table.
- **`createThunk`** (Function): Async function to handle form submission for creating a new record.
- **`updateThunk`** (Function): Async function to handle form submission for updating an existing record.
- **Optional**: You can extend the component to pass reference data, mappings, or additional functionality.

## Example Usage

```tsx
import DataTable from "./DataTable";

const YourComponent = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      price: 200,
      createdAt: "2024-09-01T08:30:00.000Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      price: 300,
      createdAt: "2024-09-02T11:00:00.000Z",
    },
  ];

  const createRecord = async (values) => {
    console.log("Creating record...", values);
  };

  const updateRecord = async (values) => {
    console.log("Updating record...", values);
  };

  return (
    <DataTable
      data={data}
      title="Orders"
      createThunk={createRecord}
      updateThunk={updateRecord}
    />
  );
};
```

## To Do's

1. Pagination.
2. Advanced Search (Reference BattlePlanApp).
3. Column Reordering.
4. Export as XLSX and PDF.
5. Import Column Mapping.
6. Row Reordering.
7. Row Grouping by Column Values.
8. Drop the Row Actions
9. Inline editing
10. Cloning of Rows
11. Change Table View (KanBan, Spreadsheet, List, Calendar, Grid of Cards)
12. Select/Deselect All Column Visibility
13. Update the documentation
