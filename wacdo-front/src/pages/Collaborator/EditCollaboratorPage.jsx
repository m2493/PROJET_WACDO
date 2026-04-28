import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function EditCollaboratorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [affectation, setAffectation] = useState({
    restaurantId: "",
    jobTitle: "",
    startDateAffectation: ""
  });

  const [restaurants, setRestaurants] = useState([]);

  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      // collaborateurs
      const collabRes = await api.get("/api/collaborators");
      const collab = collabRes.data.find(c => c.id == id);

      if (collab) {
        setForm({
          firstName: collab.firstName || "",
          lastName: collab.lastName || "",
          email: collab.email || ""
        });
      }

      // restaurants 
      const restRes = await api.get("/api/restaurants");
      setRestaurants(restRes.data);

      const jobsRes = await api.get("/api/jobs"); 
    setJobTitles(jobsRes.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleAffectationChange(e) {
    setAffectation({
      ...affectation,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 1. modifier collaborateur
      await api.put(`/api/collaborators/${id}`, form);

      // 2. créer affectation si remplie
      if (
        affectation.restaurantId &&
        affectation.jobTitle &&
        affectation.startDateAffectation
      ) {
        await api.post("/api/affectations", {
          collaboratorId: id,
          restaurantId: affectation.restaurantId,
          jobTitle: affectation.jobTitle,
          startDateAffectation:
            affectation.startDateAffectation
        });
      }

      navigate(`/collaborators/${id}`);

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    }
  }

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Modifier collaborateur
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Infos collaborateur */}
        <div className="bg-white shadow rounded p-4 space-y-4">
          <h2 className="text-xl font-semibold">
            Informations collaborateur
          </h2>

          <input
            name="lastName"
            placeholder="Nom"
            value={form.lastName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="firstName"
            placeholder="Prénom"
            value={form.firstName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Nouvelle affectation */}
        <div className="bg-white shadow rounded p-4 space-y-4">
          <h2 className="text-xl font-semibold">
            Nouvelle affectation
          </h2>

          <select
            name="restaurantId"
            value={affectation.restaurantId}
            onChange={handleAffectationChange}
            className="w-full border p-2 rounded"
          >
            <option value="">
              Choisir un restaurant
            </option>

            {restaurants.map(r => (
              <option
                key={r.id}
                value={r.id}
              >
                {r.name}
              </option>
            ))}
          </select>

          <select
  name="jobTitle"
  value={affectation.jobTitle}
  onChange={handleAffectationChange}
  className="w-full border p-2 rounded"
>
  <option value="">
    Choisir un poste
  </option>

  {jobTitles.map((job, index) => (
    <option key={job.id} value={job.labelFunction}>
  {job.labelFunction}
</option>
  ))}
</select>

          <input
            type="date"
            name="startDateAffectation"
            value={affectation.startDateAffectation}
            onChange={handleAffectationChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Enregistrer
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}