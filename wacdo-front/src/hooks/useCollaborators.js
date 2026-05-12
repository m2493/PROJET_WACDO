import { useState, useEffect } from "react";
import {
    getCollaborators,
    getNonAffectes, 
} from "../services/collaborators.services.js";

export function useCollaborators() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await getCollaborators();
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNonAffectes = async () => {
        try {
            setLoading(true);
            const res = await getNonAffectes();
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        refetch: fetchData,
        fetchNonAffectes,
    };
}