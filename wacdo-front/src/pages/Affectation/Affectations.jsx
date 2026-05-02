import { useState } from "react";
import api from "../../api/axios";
import Card from "../../components/Card";
import {
    Box,
    Heading,
    Text,
    Input,
    Button,
    SimpleGrid,
    VStack,
    HStack,
    Spinner
} from "@chakra-ui/react";

export default function AffectationSearchPage() {
    const [filters, setFilters] = useState({
        jobTitle: "",
        city: "",
        startDate: "",
        endDate: ""
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    }

    async function handleSearch() {
        setLoading(true);

        try {
            const params = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v)
            );

            const res = await api.get("/api/affectations/search", {
                params
            });

            setResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function resetFilters() {
        setFilters({
            jobTitle: "",
            city: "",
            startDate: "",
            endDate: ""
        });
        setResults([]);
    }

    return (
        <Box p={6} spaceY={6}>

            {/* HEADER */}
            <Box>
                <Heading size="lg">Recherche des affectations</Heading>
                <Text fontSize="sm" color="gray.500">
                    Filtre les affectations selon plusieurs critères
                </Text>
            </Box>

            {/* FILTER PANEL */}
            <Box bg="white" p={5} rounded="xl" shadow="md">
                <VStack spacing={4} align="stretch">

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>

                        <Box>
                            <Text fontSize="sm" mb={1}>Poste</Text>
                            <Input
                                name="jobTitle"
                                placeholder="Ex: Manager"
                                value={filters.jobTitle}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box>
                            <Text fontSize="sm" mb={1}>Ville</Text>
                            <Input
                                name="city"
                                placeholder="Ex: Paris"
                                value={filters.city}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box>
                            <Text fontSize="sm" mb={1}>Date début</Text>
                            <Input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box>
                            <Text fontSize="sm" mb={1}>Date fin</Text>
                            <Input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleChange}
                            />
                        </Box>

                    </SimpleGrid>

                    {/* ACTIONS */}
                    <HStack justify="flex-end" spacing={3}>
                        <Button variant="outline" onClick={resetFilters}>
                            Reset
                        </Button>

                        <Button
                            colorScheme="blue"
                            onClick={handleSearch}
                            isDisabled={loading}
                        >
                            {loading ? "Recherche..." : "Rechercher"}
                        </Button>
                    </HStack>

                </VStack>
            </Box>

            {/* RESULTS */}
            <Box>
                {loading && <Spinner />}

                {!loading && results.length === 0 && (
                    <Text color="gray.500">
                        Aucun résultat
                    </Text>
                )}

                <VStack spacing={3} align="stretch">
                    {results.map((a) => (
                        <Card
                            key={a.id}
                            title={`${a.jobTitle} - ${a.restaurantCity}`}
                            subtitle={`${a.startDateAffectation} → ${a.endDateAffectation || "en cours"}`}
                        />
                    ))}
                </VStack>
            </Box>

        </Box>
    );
}