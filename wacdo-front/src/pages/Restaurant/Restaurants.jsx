import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Heading,
    Button,
    Spinner,
    Center,
    SimpleGrid,
    Text,
    Stack,
    Input,
} from "@chakra-ui/react";

import { useRestaurants } from "../../hooks/useRestaurants";

export default function RestaurantListPage() {
    const { data: restaurants, loading } = useRestaurants();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        name: "",
        city: "",
        postalCode: "",
    });

    const filtered = useMemo(() => {
        return restaurants.filter((r) => {
            return (
                r.name.toLowerCase().includes(filters.name.toLowerCase()) &&
                r.city.toLowerCase().includes(filters.city.toLowerCase()) &&
                r.postalCode.includes(filters.postalCode)
            );
        });
    }, [restaurants, filters]);

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
            <Box display="flex" justifyContent="space-between" mb={6}>
                <Heading size="lg">Restaurants</Heading>

                <Button colorScheme="blue" onClick={() => navigate("/restaurants/create")}>
                    Créer un restaurant
                </Button>
            </Box>

            {/* FILTRES */}
            <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                <Stack direction={{ base: "column", md: "row" }} spacing={3}>
                    <Input
                        placeholder="Nom"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />

                    <Input
                        placeholder="Ville"
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    />

                    <Input
                        placeholder="Code postal"
                        value={filters.postalCode}
                        onChange={(e) =>
                            setFilters({ ...filters, postalCode: e.target.value })
                        }
                    />
                </Stack>
            </Box>

            {/* LISTE */}
            {filtered.length === 0 ? (
                <Center p={10} borderWidth="1px" borderRadius="lg">
                    <Text>Aucun restaurant trouvé</Text>
                </Center>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {filtered.map((r) => (
                        <Box
                            key={r.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            cursor="pointer"
                            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                            onClick={() => navigate(`/restaurants/${r.id}`)}
                        >
                            <Stack>
                                <Heading size="sm">{r.name}</Heading>
                                <Text fontSize="sm">{r.address}</Text>
                                <Text fontSize="sm" color="gray.600">
                                    {r.city} - {r.postalCode}
                                </Text>
                            </Stack>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}