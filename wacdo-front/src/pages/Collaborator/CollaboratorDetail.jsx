import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Card from "../../components/Card";

export default function CollaboratorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [collaborator, setCollaborator] = useState(null);
  const [affectations, setAffectations] = useState([]);

  const [jobFilter, setJobFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const collabRes = await api.get("/api/collaborators");
    const collab = collabRes.data.find(c => c.id == id);
    setCollaborator(collab);

    const affRes = await api.get(`/api/affectations/collaborator/${id}`);
    setAffectations(affRes.data);
  }

  if (!collaborator) return <p className="p-6">Chargement...</p>;

  const filtered = affectations.filter(a => {
    const matchJob =
      jobFilter === "" ||
      a.jobTitle?.toLowerCase().includes(jobFilter.toLowerCase());

    const matchDate =
      dateFilter === "" ||
      a.startDateAffectation === dateFilter;

    return matchJob && matchDate;
  });

  const today = new Date().toISOString().split("T")[0];

  const current = filtered.filter(
    a =>
      !a.endDateAffectation ||
      a.endDateAffectation >= today
  );

  const history = filtered.filter(
    a =>
      a.endDateAffectation &&
      a.endDateAffectation < today
  );

  return (
    <div className="p-6 space-y-6">

      <Card
        title={`${collaborator.lastName} ${collaborator.firstName}`}
        subtitle={collaborator.email}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Filtrer par poste"
          value={jobFilter}
          onChange={e => setJobFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">
          Affectations en cours
        </h2>

        {current.map(a => (
          <Card
            key={a.id}
            title={a.jobTitle}
            subtitle={`Début : ${a.startDateAffectation}`}
          />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">
          Historique des affectations
        </h2>

        {history.map(a => (
          <Card
            key={a.id}
            title={a.jobTitle}
            subtitle={`Du ${a.startDateAffectation} au ${a.endDateAffectation}`}
          />
        ))}


<div className="flex justify-end">
  <button
    onClick={() => navigate(`/collaborators/${id}/edit`)}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Modifier / Affecter un nouveau poste
  </button>
</div>

      </div>
    </div>
  );
}