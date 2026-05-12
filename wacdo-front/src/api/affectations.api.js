import api from "./axios";

export const getCurrentAffectations = (id) =>
    api.get(`/api/affectations/restaurant/${id}/current`);

export const createAffectation = (data) =>
    api.post("/api/affectations", data);