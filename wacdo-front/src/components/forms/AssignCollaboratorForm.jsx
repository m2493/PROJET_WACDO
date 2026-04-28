import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AssignCollaboratorForm({ onAssign }) {
  const [collaborators, setCollaborators] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [collaboratorId, setCollaboratorId] = useState("");
  const [jobId, setJobId] = useState("");
  const [startDateAffectation, setStartDateAffectation] = useState("");

  useEffect(() => {
    api.get("/api/collaborators/non-affectes")
      .then(res => setCollaborators(res.data));

    api.get("/api/jobs")
      .then(res => setJobs(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign({ collaboratorId, jobId, startDateAffectation });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">

      <select onChange={e => setCollaboratorId(e.target.value)}>
        <option value="">Collaborateur</option>
        {collaborators.map(c => (
          <option key={c.id} value={c.id}>
            {c.firstName} {c.lastName}
          </option>
        ))}
      </select>

      <select onChange={e => setJobId(e.target.value)}>
        <option value="">Poste</option>
        {jobs.map(j => (
          <option key={j.id} value={j.id}>
            {j.labelFunction}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={startDateAffectation}
        onChange={e => setStartDateAffectation(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-3 py-1 rounded">
        Affecter
      </button>
    </form>
  );
}