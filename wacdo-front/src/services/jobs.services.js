import api from "../api/axios";

export const getJobs = () => {
    return api.get("/jobs");
};

export const getJobById = (id) => {
    return api.get(`/jobs/${id}`);
};

export const createJob = (data) => {
    return api.post("/jobs", data);
};

export const updateJob = (id, data) => {
    return api.put(`/jobs/${id}`, data);
};