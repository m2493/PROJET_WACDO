import api from "../api/axios";

export const getAffectationsByCollaborator = (id) => {
    return api.get(`/affectations/collaborator/${id}`);
};

export const getCurrentRestaurantAffectations = (id) => {
    return api.get(`/affectations/restaurant/${id}/current`);
};

export const createAffectation = (data) => {
    return api.post("/affectations", data);
};

export const updateAffectation = (id, data) => {
    return api.put(`/affectations/${id}`, data);
};