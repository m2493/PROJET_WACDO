import { useEffect, useState } from "react";
import { getCollaboratorById } from "../api/collaborators.api";

export function useCollaborator(id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await getCollaboratorById(id);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { data, loading };
}