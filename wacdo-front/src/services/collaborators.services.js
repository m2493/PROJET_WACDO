import api from "../api/axios";

export const getCollaborators = () => {
    return api.get("/api/collaborators");
};

export const getCollaboratorById = (id) => {
    return api.get(`/api/collaborators/${id}`);
};

export const createCollaborator = (data) => {
    return api.post("/api/collaborators", data);
};

export const updateCollaborator = (id, data) => {
    return api.put(`/api/collaborators/${id}`, data);
};

export const getNonAffectes = () => {
    return api.get("/api/collaborators/non-affectes");
};