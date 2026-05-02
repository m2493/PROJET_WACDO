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
} from "@chakra-ui/react";

export default function RestaurantListPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const res = await api.get("/api/restaurants");

                const data =
                    typeof res.data === "string"
                        ? JSON.parse(res.data)
                        : res.data;

                setRestaurants(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchRestaurants();
    }, []);

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
                <Heading size="lg">
                    Restaurants
                </Heading>

                <Button
                    colorScheme="blue"
                    onClick={() =>
                        navigate("/restaurants/create")
                    }
                >
                    Créer un restaurant
                </Button>
            </Box>

            {/* EMPTY STATE */}
            {restaurants.length === 0 ? (
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
                    {restaurants.map((r) => (
                        <Box
                            key={r.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            cursor="pointer"
                            _hover={{
                                shadow: "md",
                                transform: "translateY(-2px)",
                            }}
                            transition="0.2s"
                            onClick={() =>
                                navigate(`/restaurants/${r.id}`)
                            }
                        >
                            <Stack spacing={1}>
                                <Heading size="sm">
                                    {r.name}
                                </Heading>

                                <Text fontSize="sm" color="gray.600">
                                    {r.address}
                                </Text>

                                <Text fontSize="sm" color="gray.500">
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