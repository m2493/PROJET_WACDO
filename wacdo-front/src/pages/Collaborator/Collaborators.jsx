import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
/*import axios from "axios";*/
import api from "../../api/axios";
import ListWithFilter from "../../components/ListWithFilter";
import Card from "../../components/Card";

export default function CollaboratorListPage() {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        const res = await api.get("/api/collaborators");
        const data = typeof res.data === "string"
  ? JSON.parse(res.data)
  : res.data;

setCollaborators(data);
        console.log("TYPE =", typeof res.data);
console.log("IS ARRAY =", Array.isArray(res.data));
console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollaborators();
  }, []);

  // Recherche collaborateurs non affectés
  async function fetchNonAffectes() {
    try {
      setLoading(true);

      const res = await api.get("/api/collaborators/non-affectes");
      const data =
        typeof res.data === "string"
          ? JSON.parse(res.data)
          : res.data;

      setCollaborators(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        
        <button
          onClick={fetchNonAffectes}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Rechercher les collaborateurs non affectés
        </button>
        
        
        <button 
          onClick={() => navigate("/collaborators/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Créer un collaborateur
        </button>
      </div>

      <ListWithFilter
        items={collaborators}
        filterFields={[
          { name: "lastName", placeholder: "Nom" },
          { name: "firstName", placeholder: "Prénom" },
          { name: "email", placeholder: "Email" }
        ]}
        renderItem={r => (
          <div onClick={() => navigate(`/collaborators/${r.id}`)}>
            <Card
              key={r.id}
              title={`${r.lastName} - ${r.firstName}`}
              subtitle={`${r.email}`}
            />
          </div>
        )}
      />
    </div>
  );
}