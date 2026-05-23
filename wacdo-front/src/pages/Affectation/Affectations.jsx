import { useState, useEffect } from "react";
import api from "../../api/axios";

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

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <VStack spacing={8} align="stretch" p={6}>

            {/* HEADER */}
            <Box>
                <Heading size="lg">Recherche des affectations</Heading>
                <Text fontSize="sm" color="gray.500">
                    Filtre les affectations selon plusieurs critères
                </Text>
            </Box>

            {/* FILTERS */}
            <Box bg="white" p={6} rounded="xl" shadow="md">
                <VStack spacing={5} align="stretch">

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>

                        <Box>
                            <Text fontSize="sm" mb={2}>Poste</Text>
                            <Input name="jobTitle" value={filters.jobTitle} onChange={handleChange} />
                        </Box>

                        <Box>
                            <Text fontSize="sm" mb={2}>Ville</Text>
                            <Input name="city" value={filters.city} onChange={handleChange} />
                        </Box>

                        <Box>
                            <Text fontSize="sm" mb={2}>Date début</Text>
                            <Input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
                        </Box>

                        <Box>
                            <Text fontSize="sm" mb={2}>Date fin</Text>
                            <Input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
                        </Box>

                    </SimpleGrid>

                    <HStack justify="flex-end" spacing={3}>
                        <Button variant="outline" onClick={resetFilters}>
                            Reset
                        </Button>

                        <Button colorScheme="blue" onClick={handleSearch} isLoading={loading}>
                            Rechercher
                        </Button>
                    </HStack>

                </VStack>
            </Box>

            {/* RESULTS */}
            <Box>
                {loading && <Spinner />}

                {!loading && results.length === 0 && (
                    <Text color="gray.500">Aucun résultat</Text>
                )}

                <VStack spacing={4} align="stretch" mt={4}>

                    {results.map((a) => (
                        <Box
                            key={a.id}
                            p={4}
                            bg="white"
                            shadow="sm"
                            rounded="lg"
                            borderWidth="1px"
                        >
                            <Text fontWeight="bold">
                                {a.jobTitle} - {a.restaurantCity}
                            </Text>

                            <Text fontSize="sm" color="gray.600">
                                {a.startDateAffectation} → {a.endDateAffectation || "en cours"}
                            </Text>
                        </Box>
                    ))}

                </VStack>
            </Box>

        </VStack>
    );
}