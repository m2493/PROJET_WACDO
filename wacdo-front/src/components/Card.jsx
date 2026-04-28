//Carte générique
// /src/components/Card.jsx
export default function Card({ title, subtitle, children, onClick, className }) {
  return (
    <div
      className={`border p-4 rounded shadow hover:bg-gray-50 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {title && <h2 className="text-lg font-bold">{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
}