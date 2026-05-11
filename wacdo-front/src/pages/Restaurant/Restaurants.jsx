import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
    HStack,
} from "@chakra-ui/react";

export default function RestaurantListPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        name: "",
        city: "",
        postalCode: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, restaurants]);

    async function fetchRestaurants() {
        try {
            const res = await api.get("/api/restaurants");

            const data =
                typeof res.data === "string"
                    ? JSON.parse(res.data)
                    : res.data;

            setRestaurants(data);
            setFiltered(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function applyFilters() {
        let result = [...restaurants];

        if (filters.name) {
            result = result.filter((r) =>
                r.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.city) {
            result = result.filter((r) =>
                r.city.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.postalCode) {
            result = result.filter((r) =>
                r.postalCode
                    .toLowerCase()
                    .includes(filters.postalCode.toLowerCase())
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
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={6}
            >
                <Heading size="lg">Restaurants</Heading>

                <Button
                    colorScheme="blue"
                    onClick={() =>
                        navigate("/restaurants/create")
                    }
                >
                    Créer un restaurant
                </Button>
            </Box>

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

                <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={3}
                >
                    <Input
                        placeholder="Nom"
                        value={filters.name}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                name: e.target.value,
                            })
                        }
                    />

                    <Input
                        placeholder="Ville"
                        value={filters.city}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                city: e.target.value,
                            })
                        }
                    />

                    <Input
                        placeholder="Code postal"
                        value={filters.postalCode}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                postalCode: e.target.value,
                            })
                        }
                    />
                </Stack>
            </Box>

            {/* EMPTY STATE */}
            {filtered.length === 0 ? (
                <Center
                    p={10}
                    borderWidth="1px"
                    borderRadius="lg"
                >
                    <Text>Aucun restaurant trouvé</Text>
                </Center>
            ) : (
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={4}
                >
                    {filtered.map((r) => (
                        <Box
                            key={r.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            cursor="pointer"
                            _hover={{
                                shadow: "md",
                                transform:
                                    "translateY(-2px)",
                            }}
                            transition="0.2s"
                            onClick={() =>
                                navigate(
                                    `/restaurants/${r.id}`
                                )
                            }
                        >
                            <Stack spacing={1}>
                                <Heading size="sm">
                                    {r.name}
                                </Heading>

                                <Text
                                    fontSize="sm"
                                    color="gray.600"
                                >
                                    {r.address}
                                </Text>

                                <Text
                                    fontSize="sm"
                                    color="gray.500"
                                >
                                    {r.city} -{" "}
                                    {r.postalCode}
                                </Text>
                            </Stack>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}