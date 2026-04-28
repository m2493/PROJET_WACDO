import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
/*import axios from "axios";*/
import api from "../../api/axios";
import ListWithFilter from "../../components/ListWithFilter";
import Card from "../../components/Card";

export default function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await api.get("/api/restaurants");
        const data = typeof res.data === "string"
  ? JSON.parse(res.data)
  : res.data;

setRestaurants(data);
        console.log("TYPE =", typeof res.data);
console.log("IS ARRAY =", Array.isArray(res.data));
console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => navigate("/restaurants/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Créer un restaurant
        </button>
      </div>

      <ListWithFilter
        items={restaurants}
        filterFields={[
          { name: "name", placeholder: "Nom" },
          { name: "city", placeholder: "Ville" },
          { name: "postalCode", placeholder: "Code postal" }
        ]}
        renderItem={r => (
          <div onClick={() => navigate(`/restaurants/${r.id}`)}>
            <Card
              key={r.id}
              title={r.name}
              subtitle={`${r.address} - ${r.city} - ${r.postalCode}`}
            />
          </div>
        )}
      />
    </div>
  );
}