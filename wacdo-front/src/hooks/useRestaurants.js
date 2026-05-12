import { useEffect, useState } from "react";
import { getRestaurants } from "../api/restaurants.api";

export function useRestaurants() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRestaurants()
            .then((res) => setData(res.data))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading };
}