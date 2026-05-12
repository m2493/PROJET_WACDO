import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Heading,
    Input,
    SimpleGrid,
    Text,
    Spinner,
    Center,
    HStack,
    Stack,
} from "@chakra-ui/react";

import { useCollaborators } from "../../hooks/useCollaborators";

export default function CollaboratorListPage() {
    const { data: collaborators, loading, fetchNonAffectes } =
        useCollaborators();

    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        lastName: "",
        firstName: "",
        email: "",
    });

    const filtered = useMemo(() => {
        return collaborators.filter((c) => {
            return (
                c.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
                c.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
                c.email.toLowerCase().includes(filters.email.toLowerCase())
            );
        });
    }, [collaborators, filters]);

    if (loading) {
        return (
            <Center h="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Box p={6}>
            <HStack justify="space-between" mb={6}>
                <Heading size="lg">Collaborateurs</Heading>

                <HStack>
                    <Button colorScheme="orange" onClick={fetchNonAffectes}>
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
            <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
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
                            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                            onClick={() => navigate(`/collaborators/${c.id}`)}
                        >
                            <Text fontWeight="bold">
                                {c.lastName} {c.firstName}
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