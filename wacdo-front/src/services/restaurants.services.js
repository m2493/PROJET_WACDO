import api from "../api/axios";

export const getRestaurants = () => {
    return api.get("/restaurants");
};

export const getRestaurantById = (id) => {
    return api.get(`/restaurants/${id}`);
};

export const createRestaurant = (data) => {
    return api.post("/restaurants", data);
};

export const updateRestaurant = (id, data) => {
    return api.put(`/restaurants/${id}`, data);
};

export const deleteRestaurant = (id) => {
    return api.delete(`/restaurants/${id}`);
};