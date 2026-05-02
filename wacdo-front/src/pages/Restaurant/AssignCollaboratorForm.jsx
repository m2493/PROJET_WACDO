import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AssignCollaboratorForm({ onAssign }) {
    const [collaborators, setCollaborators] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [collaboratorId, setCollaboratorId] = useState("");
    const [jobId, setJobId] = useState("");
    const [startDate, setStartDate] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [resC, resJ] = await Promise.all([
                api.get("/api/collaborators/non-affectes"),
                api.get("/api/jobs")
            ]);

            setCollaborators(resC.data);
            setJobs(resJ.data);

            setStartDate(new Date().toISOString().split("T")[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onAssign({
            collaboratorId: Number(collaboratorId),
            jobId: Number(jobId),
            startDate
        });
    };

    if (loading) {
        return <p className="text-sm text-gray-500">Chargement du formulaire...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Collaborateur */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Collaborateur
                </label>

                <select
                    value={collaboratorId}
                    onChange={(e) => setCollaboratorId(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                    <option value="">-- Choisir un collaborateur --</option>
                    {collaborators.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.firstname} {c.lastname}
                        </option>
                    ))}
                </select>
            </div>

            {/* Poste */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Poste
                </label>

                <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                    <option value="">-- Choisir un poste --</option>
                    {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                            {j.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Date de début
                </label>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={!collaboratorId || !jobId}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
                Affecter
            </button>
        </form>
    );
}