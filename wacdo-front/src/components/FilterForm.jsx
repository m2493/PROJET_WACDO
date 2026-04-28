//Formulaire réutilisable
// /src/components/FilterForm.jsx
import React from "react";

export default function FilterForm({ fields, onSearch, className }) {
  const [values, setValues] = React.useState(
    Object.fromEntries(fields.map(f => [f.name, ""]))
  );

  const handleChange = (name, value) => setValues(v => ({ ...v, [name]: value }));
  const handleSubmit = e => {
    e.preventDefault();
    onSearch(values);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {fields.map(f => (
        <input
          key={f.name}
          type={f.type || "text"}
          placeholder={f.placeholder}
          value={values[f.name]}
          onChange={e => handleChange(f.name, e.target.value)}
          className="border rounded px-2 py-1"
        />
      ))}
      <button type="submit" className="bg-gray-700 text-white px-3 py-1 rounded">
        Rechercher
      </button>
    </form>
  );
}