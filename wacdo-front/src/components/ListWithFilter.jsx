import React from "react";
import FilterForm from "./FilterForm";

export default function ListWithFilter({ items, filterFields, renderItem, className }) {
  // On s'assure que items est un tableau
  const safeItems = Array.isArray(items) ? items : [];
  const [filtered, setFiltered] = React.useState(safeItems);

  React.useEffect(() => {
    setFiltered(Array.isArray(items) ? items : []);
  }, [items]);

  const handleFilter = values => {
    const newFiltered = (Array.isArray(items) ? items : []).filter(item =>
      Object.keys(values).every(key =>
        !values[key] || String(item[key] || "").toLowerCase().includes(values[key].toLowerCase())
      )
    );
    setFiltered(newFiltered);
  };

  return (
    <div className={className}>
      {filterFields && <FilterForm fields={filterFields} onSearch={handleFilter} />}
      <div className="grid gap-4 mt-2">
        {filtered.map(renderItem)}
      </div>
    </div>
  );
}