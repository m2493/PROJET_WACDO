import { useEffect, useState } from "react";
import {
    getCurrentAffectations,
    createAffectation,
} from "../api/affectations.api";

export function useAffectations(restaurantId) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAffectations = async () => {
        try {
            const res = await getCurrentAffectations(restaurantId);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addAffectation = async (payload) => {
        await createAffectation(payload);
        await fetchAffectations(); // refresh automatique
    };

    useEffect(() => {
        if (restaurantId) {
            fetchAffectations();
        }
    }, [restaurantId]);

    return {
        data,
        loading,
        refetch: fetchAffectations,
        addAffectation,
    };
}