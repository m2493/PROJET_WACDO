import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
    VStack,
    FormControl,
    FormLabel,
    Select,
    Input,
    Button,
    Spinner,
    Center,
} from "@chakra-ui/react";

export default function AssignCollaboratorForm({ onAssign }) {
    const [collaborators, setCollaborators] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [collaboratorId, setCollaboratorId] = useState("");
    const [jobId, setJobId] = useState("");
    const [startDateAffectation, setStartDateAffectation] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const resC = await api.get("/api/collaborators/non-affectes");
                const resJ = await api.get("/api/jobs");

                setCollaborators(resC.data);
                setJobs(resJ.data);

                setStartDateAffectation(
                    new Date().toISOString().split("T")[0]
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        onAssign({
            collaboratorId: Number(collaboratorId),
            jobId: Number(jobId),
            startDateAffectation,
        });
    };

    if (loading) {
        return (
            <Center py={6}>
                <Spinner />
            </Center>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">

                <FormControl isRequired>
                    <FormLabel>Collaborateur</FormLabel>
                    <Select
                        placeholder="Sélectionner un collaborateur"
                        value={collaboratorId}
                        onChange={(e) => setCollaboratorId(e.target.value)}
                    >
                        {collaborators.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.firstName} {c.lastName}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Poste</FormLabel>
                    <Select
                        placeholder="Sélectionner un poste"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                    >
                        {jobs.map((j) => (
                            <option key={j.id} value={j.id}>
                                {j.labelFunction}
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Date de début</FormLabel>
                    <Input
                        type="date"
                        value={startDateAffectation}
                        onChange={(e) =>
                            setStartDateAffectation(e.target.value)
                        }
                    />
                </FormControl>

                <Button
                    colorScheme="blue"
                    type="submit"
                    w="full"
                >
                    Affecter
                </Button>

            </VStack>
        </form>
    );
}