import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function EditAffectationPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        restaurantId: "",
        jobId: "",
        startDateAffectation: "",
        endDateAffectation: ""
    });

    const [restaurants, setRestaurants] = useState([]);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const aff = await api.get(`/api/affectations/${id}`);
        const rest = await api.get("/api/restaurants");
        const jobsRes = await api.get("/api/jobs");

        setRestaurants(rest.data);
        setJobs(jobsRes.data);

        setForm({
            restaurantId: aff.data.restaurantId,
            jobId: aff.data.jobId,
            startDateAffectation: aff.data.startDateAffectation,
            endDateAffectation: aff.data.endDateAffectation || ""
        });
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        await api.put(`/api/affectations/${id}`, {
            ...form,
            restaurantId: Number(form.restaurantId),
            jobId: Number(form.jobId)
        });

        navigate(-1);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                Modifier affectation
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <select
                    name="restaurantId"
                    value={form.restaurantId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    {restaurants.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <select
                    name="jobId"
                    value={form.jobId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    {jobs.map(j => (
                        <option key={j.id} value={j.id}>
                            {j.labelFunction}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    name="startDateAffectation"
                    value={form.startDateAffectation}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="date"
                    name="endDateAffectation"
                    value={form.endDateAffectation}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
}