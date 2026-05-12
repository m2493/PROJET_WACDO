import api from "./axios";

export const getCollaborators = () =>
    api.get("/api/collaborators");

export const getNonAffectes = () =>
    api.get("/api/collaborators/non-affectes");