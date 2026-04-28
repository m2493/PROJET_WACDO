import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AssignCollaboratorForm({ onAssign }) {

  const [collaborators, setCollaborators] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [collaboratorId, setCollaboratorId] = useState("");
  const [jobId, setJobId] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const resC = await api.get("/api/collaborators/non-affectes");
    setCollaborators(resC.data);

    const resJ = await api.get("/api/jobs");
    setJobs(resJ.data);

    setStartDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAssign({
      collaboratorId: Number(collaboratorId),
      jobId: Number(jobId),
      startDate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

      <select
        value={collaboratorId}
        onChange={(e) => setCollaboratorId(e.target.value)}
        required
      >
        <option value="">-- Collaborateur --</option>
        {collaborators.map(c => (
          <option key={c.id} value={c.id}>
            {c.firstname} {c.lastname}
          </option>
        ))}
      </select>

      <select
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        required
      >
        <option value="">-- Poste --</option>
        {jobs.map(j => (
          <option key={j.id} value={j.id}>
            {j.title}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Affecter
      </button>

    </form>
  );
}