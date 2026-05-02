import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import {
    Box,
    Button,
    Heading,
    Select,
    Input,
    SimpleGrid,
    Text,
    Spinner,
    VStack,
    HStack
} from "@chakra-ui/react";

export default function EditAffectationPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        restaurantId: "",
        jobId: "",
        startDateAffectation: "",
        endDateAffectation: ""
    });

    const [restaurants, setRestaurants] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [aff, rest, jobsRes] = await Promise.all([
                api.get(`/api/affectations/${id}`),
                api.get("/api/restaurants"),
                api.get("/api/jobs")
            ]);

            setRestaurants(rest.data);
            setJobs(jobsRes.data);

            setForm({
                restaurantId: aff.data.restaurantId,
                jobId: aff.data.jobId,
                startDateAffectation: aff.data.startDateAffectation,
                endDateAffectation: aff.data.endDateAffectation || ""
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        await api.put(`/api/affectations/${id}`, {
            ...form,
            restaurantId: Number(form.restaurantId),
            jobId: Number(form.jobId)
        });

        navigate(-1);
    }

    if (loading) {
        return (
            <Box p={6}>
                <Spinner />
            </Box>
        );
    }

    return (
        <Box p={6} maxW="lg" mx="auto">
            <VStack align="stretch" spacing={6}>

                <Box>
                    <Heading size="lg">Modifier affectation</Heading>
                    <Text color="gray.500" fontSize="sm">
                        Mise à jour des informations de l’affectation
                    </Text>
                </Box>

                <Box as="form" onSubmit={handleSubmit} bg="white" p={5} rounded="xl" shadow="md">
                    <VStack spacing={4} align="stretch">

                        <Box>
                            <Text fontSize="sm" mb={1}>Restaurant</Text>
                            <Select
                                name="restaurantId"
                                value={form.restaurantId}
                                onChange={handleChange}
                            >
                                {restaurants.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Box>
                            <Text fontSize="sm" mb={1}>Poste</Text>
                            <Select
                                name="jobId"
                                value={form.jobId}
                                onChange={handleChange}
                            >
                                {jobs.map((j) => (
                                    <option key={j.id} value={j.id}>
                                        {j.labelFunction}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <SimpleGrid columns={2} spacing={4}>
                            <Box>
                                <Text fontSize="sm" mb={1}>Date début</Text>
                                <Input
                                    type="date"
                                    name="startDateAffectation"
                                    value={form.startDateAffectation}
                                    onChange={handleChange}
                                />
                            </Box>

                            <Box>
                                <Text fontSize="sm" mb={1}>Date fin</Text>
                                <Input
                                    type="date"
                                    name="endDateAffectation"
                                    value={form.endDateAffectation}
                                    onChange={handleChange}
                                />
                            </Box>
                        </SimpleGrid>

                        <HStack justify="flex-end" spacing={3}>
                            <Button variant="outline" onClick={() => navigate(-1)}>
                                Annuler
                            </Button>

                            <Button colorScheme="blue" type="submit">
                                Enregistrer
                            </Button>
                        </HStack>

                    </VStack>
                </Box>

            </VStack>
        </Box>
    );
}