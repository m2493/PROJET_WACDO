//Modale générique

// /src/components/Modal.jsx
export default function Modal({ title, children, onClose, className }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className={`bg-white p-6 rounded shadow w-96 ${className}`}>
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 border rounded">Fermer</button>
        </div>
      </div>
    </div>
  );
}