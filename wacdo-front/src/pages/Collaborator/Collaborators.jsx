import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
    Box,
    Button,
    Heading,
    Input,
    SimpleGrid,
    Stack,
    Text,
    Spinner,
    Center,
    HStack,
    useToast,
} from "@chakra-ui/react";

export default function CollaboratorListPage() {
    const [collaborators, setCollaborators] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        lastName: "",
        firstName: "",
        email: "",
    });

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchCollaborators();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, collaborators]);

    async function fetchCollaborators() {
        try {
            const res = await api.get("/api/collaborators");

            const data =
                typeof res.data === "string"
                    ? JSON.parse(res.data)
                    : res.data;

            setCollaborators(data);
            setFiltered(data);
        } catch (err) {
            console.error(err);

            toast({
                title: "Erreur",
                description: "Impossible de charger les collaborateurs",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    async function fetchNonAffectes() {
        try {
            setLoading(true);

            const res = await api.get("/api/collaborators/non-affectes");

            const data =
                typeof res.data === "string"
                    ? JSON.parse(res.data)
                    : res.data;

            setCollaborators(data);
        } catch (err) {
            console.error(err);

            toast({
                title: "Erreur",
                description: "Impossible de filtrer les collaborateurs",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    function applyFilters() {
        let result = [...collaborators];

        if (filters.lastName) {
            result = result.filter((c) =>
                c.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
            );
        }

        if (filters.firstName) {
            result = result.filter((c) =>
                c.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
            );
        }

        if (filters.email) {
            result = result.filter((c) =>
                c.email.toLowerCase().includes(filters.email.toLowerCase())
            );
        }

        setFiltered(result);
    }

    if (loading) {
        return (
            <Center h="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Box p={6}>
            {/* HEADER */}
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Collaborateurs</Heading>

                <HStack spacing={3}>
                    <Button
                        colorScheme="orange"
                        onClick={fetchNonAffectes}
                    >
                        Non affectés
                    </Button>

                    <Button
                        colorScheme="blue"
                        onClick={() => navigate("/collaborators/create")}
                    >
                        Créer
                    </Button>
                </HStack>
            </HStack>

            {/* FILTRES */}
            <Box
                mb={6}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                bg="gray.50"
            >
                <Text fontWeight="bold" mb={3}>
                    Recherche
                </Text>

                <Stack direction={{ base: "column", md: "row" }} spacing={3}>
                    <Input
                        placeholder="Nom"
                        value={filters.lastName}
                        onChange={(e) =>
                            setFilters({ ...filters, lastName: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Prénom"
                        value={filters.firstName}
                        onChange={(e) =>
                            setFilters({ ...filters, firstName: e.target.value })
                        }
                    />

                    <Input
                        placeholder="Email"
                        value={filters.email}
                        onChange={(e) =>
                            setFilters({ ...filters, email: e.target.value })
                        }
                    />
                </Stack>
            </Box>

            {/* LISTE */}
            {filtered.length === 0 ? (
                <Text>Aucun collaborateur trouvé</Text>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {filtered.map((c) => (
                        <Box
                            key={c.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            cursor="pointer"
                            _hover={{
                                shadow: "md",
                                transform: "translateY(-2px)",
                            }}
                            transition="0.2s"
                            onClick={() => navigate(`/collaborators/${c.id}`)}
                        >
                            <Text fontWeight="bold">
                                {c.lastName} - {c.firstName}
                            </Text>

                            <Text fontSize="sm" color="gray.600">
                                {c.email}
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}