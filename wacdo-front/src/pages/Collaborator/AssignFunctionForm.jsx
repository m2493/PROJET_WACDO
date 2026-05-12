import { useEffect, useState } from "react";
import api from "../api/axios";

import {
    Box,
    Select,
    Input,
    Button,
    Stack,
    Text,
} from "@chakra-ui/react";



export default function AssignCollaboratorForm({ onAssign }) {
    const [collaborators, setCollaborators] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [collaboratorId, setCollaboratorId] = useState("");
    const [jobId, setJobId] = useState("");
    const [startDate, setStartDate] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const resC = await api.get("/api/collaborators/non-affectes");
        setCollaborators(resC.data);

        const resJ = await api.get("/api/jobs");
        setJobs(resJ.data);

        setStartDate(new Date().toISOString().split("T")[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onAssign({
            collaboratorId: Number(collaboratorId),
            jobId: Number(jobId),
            startDate,
        });
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
                <Text fontWeight="bold">
                    Nouvelle affectation
                </Text>

                <Text>
                    {collaboratorId} | {jobId} | {startDate}
                </Text>

                {/* COLLAB */}
                <Select
                    placeholder="Choisir un collaborateur"
                    value={collaboratorId}
                    onChange={(e) =>
                        setCollaboratorId(e.target.value)
                    }
                    bg="white"
                >
                    {collaborators.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.firstname} {c.lastname}
                        </option>
                    ))}
                </Select>

                {/* JOB */}
                <Select
                    placeholder="Choisir un poste"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    bg="white"
                >
                    {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                            {j.labelFunction || j.title}
                        </option>
                    ))}
                </Select>

                {/* DATE */}
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                        setStartDate(e.target.value)
                    }
                    bg="white"
                />

                {/* ACTION */}
                <Button
                    type="submit"
                    colorScheme="green"
                >
                    Affecter
                </Button>
            </Stack>
        </Box>
    );
}