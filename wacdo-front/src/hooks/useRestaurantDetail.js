import { useEffect, useState } from "react";
import {
    getRestaurantById,
} from "../api/restaurants.api";

import { getCurrentAffectations } from "../api/affectations.api";

export function useRestaurantDetail(id) {
    const [restaurant, setRestaurant] = useState(null);
    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [r, a] = await Promise.all([
                    getRestaurantById(id),
                    getCurrentAffectations(id),
                ]);

                setRestaurant(r.data);
                setAffectations(a.data);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    return { restaurant, affectations, loading };
}