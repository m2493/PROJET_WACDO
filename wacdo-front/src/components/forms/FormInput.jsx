import { useField } from "formik";

export default function FormInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        {...field}
        {...props}
        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 
        ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"}`}
      />

      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  );
}