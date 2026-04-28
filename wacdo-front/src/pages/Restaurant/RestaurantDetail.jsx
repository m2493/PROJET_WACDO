import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Modal from "../../components/Modal";
import ListWithFilter from "../../components/ListWithFilter";
import Card from "../../components/Card";
import AssignCollaboratorForm from "../../components/forms/AssignCollaboratorForm";

export default function RestaurantDetailPage() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [affectations, setAffectations] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const resRestaurant = await api.get(`/api/restaurants/${id}`);
      setRestaurant(resRestaurant.data);

      const resAffectations = await api.get(`/api/affectations/restaurant/${id}/current`);

      console.log("RAW AFFECTATIONS =", resAffectations.data);

      setAffectations(resAffectations.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    const res = await api.get("/api/affectations");
    setHistory(res.data.filter(a => a.restaurantId === Number(id)));
  };

  const handleAssign = async (data) => {
    try {
      await api.post("/api/affectations", {
        collaboratorId: data.collaboratorId,
        restaurantId: Number(id),
        jobId: data.jobId,
        startDateAffectation: data.startDateAffectation 
      });

      setShowAssignModal(false);
      fetchData();

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;
  if (!restaurant) return <p className="p-6">Restaurant introuvable</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{restaurant.name}</h1>

      <div className="flex gap-2 mb-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => setShowAssignModal(true)}
        >
          Affecter
        </button>

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowHistory(!showHistory);
            loadHistory();
          }}
        >
          Historique
        </button>
      </div>

      <ListWithFilter
        items={showHistory ? history : affectations}
        filterFields={[
          { name: "collaboratorLastName", placeholder: "Nom" },
          { name: "jobTitle", placeholder: "Poste" },
          { name: "startDate", placeholder: "Date début", type: "date" }
        ]}
        renderItem={a => (
          <Card
            key={a.id}
            title={`${a.collaboratorFirstName} ${a.collaboratorLastName}`.trim() || a.collaboratorEmail}
            subtitle={`${a.jobTitle} - ${a.startDateAffectation} ${a.endDateAffectation ? "→ " + a.endDateAffectation : ""}`}
        />
        )}
      />

      {showAssignModal && (
        <Modal title="Affecter un collaborateur" onClose={() => setShowAssignModal(false)}>
          <AssignCollaboratorForm onAssign={handleAssign} />
        </Modal>
      )}
    </div>
  );
}