import { useState } from "react";
import api from "../../api/axios";
import Card from "../../components/Card";

export default function AffectationSearchPage() {
    const [filters, setFilters] = useState({
        jobTitle: "",
        city: "",
        startDate: "",
        endDate: ""
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    }

    async function handleSearch() {
        setLoading(true);

        try {
            const params = {};

            if (filters.jobTitle) params.jobTitle = filters.jobTitle;
            if (filters.city) params.city = filters.city;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;

            const res = await api.get("/api/affectations/search", {
                params
            });

            setResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function resetFilters() {
        setFilters({
            jobTitle: "",
            city: "",
            startDate: "",
            endDate: ""
        });
        setResults([]);
    }

    return (
        <div className="p-6 space-y-6">

            <h1 className="text-2xl font-bold">
                Recherche des affectations
            </h1>

            {/* FILTRES */}
            <div className="grid grid-cols-2 gap-4 bg-white p-4 shadow rounded">

                <input
                    name="jobTitle"
                    placeholder="Poste"
                    value={filters.jobTitle}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="city"
                    placeholder="Ville"
                    value={filters.city}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Rechercher
                </button>

                <button
                    onClick={resetFilters}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Reset
                </button>
            </div>

            {/* LOADING */}
            {loading && <p>Chargement...</p>}

            {/* RESULTATS */}
            <div className="space-y-3">

                {results.length === 0 && !loading && (
                    <p>Aucun résultat</p>
                )}

                {results.map(a => (
                    <Card
                        key={a.id}
                        title={`${a.jobTitle} - ${a.restaurantCity}`}
                        subtitle={`${a.startDateAffectation} → ${a.endDateAffectation || "en cours"}`}
                    />
                ))}

            </div>

        </div>
    );
}