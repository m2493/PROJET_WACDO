import { useEffect, useState } from "react";
import api from "../api/axios";

export function useJobs() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/api/jobs");
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createJob = async (payload) => {
        const res = await api.post("/api/jobs", payload);
        setData((prev) => [...prev, res.data]);
        return res.data;
    };

    const updateJob = async (id, payload) => {
        const res = await api.put(`/api/jobs/${id}`, payload);

        setData((prev) =>
            prev.map((job) => (job.id === id ? res.data : job))
        );
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return {
        data,
        loading,
        createJob,
        updateJob,
    };
}