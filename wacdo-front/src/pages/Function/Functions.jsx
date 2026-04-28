import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ListWithFilter from "../../components/ListWithFilter";
import Card from "../../components/Card";

export default function FunctionsListPage() {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [labelFunction, setLabelFunction] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFunctions();
  }, []);

  async function fetchFunctions() {
    try {
      const res = await api.get("/api/jobs");
      setFunctions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(item) {
    setSelectedItem(item);
    setLabelFunction(item.labelFunction);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelectedItem(null);
    setLabelFunction("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!labelFunction.trim()) return;

    try {
      setSaving(true);

      const res = await api.put(`/api/jobs/${selectedItem.id}`, {
        id: selectedItem.id,
        labelFunction: labelFunction,
      });

      const updated = res.data;

      setFunctions((prev) =>
        prev.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des fonctions</h1>

        <button
          onClick={() => navigate("/function/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Créer une fonction
        </button>
      </div>

      {/* LISTE */}
      <ListWithFilter
        items={functions}
        renderItem={(item) => (
          <div key={item.id} className="mb-4">
            <Card title={item.labelFunction} />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEditModal(item)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded"
              >
                Modifier
              </button>
            </div>
          </div>
        )}
      />

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Modifier la fonction
            </h2>

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-2">
                Libellé
              </label>

              <input
                type="text"
                value={labelFunction}
                onChange={(e) =>
                  setLabelFunction(e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 mb-4"
                placeholder="Ex: Manager"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  {saving ? "Enregistrement..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}