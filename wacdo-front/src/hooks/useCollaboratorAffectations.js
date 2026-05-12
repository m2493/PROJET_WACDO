import { useEffect, useState } from "react";
import api from "../api/axios";

export function useCollaboratorAffectations(id) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetch = async () => {
            try {
                const res = await api.get(
                    `/api/affectations/collaborator/${id}`
                );
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    return { data, loading };
}