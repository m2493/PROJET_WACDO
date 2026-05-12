import api from "./axios";

export const getRestaurants = () =>
    api.get("/api/restaurants");

export const getRestaurantById = (id) =>
    api.get(`/api/restaurants/${id}`);