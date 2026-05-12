import { useParams } from "react-router-dom";
import {
    Box,
    Heading,
    Button,
    Text,
    Spinner,
    Center,
    Stack,
    SimpleGrid, Input,
} from "@chakra-ui/react";

import Modal from "../../components/Modal";
import AssignCollaboratorForm from "../../components/forms/AssignCollaboratorForm";

import { useDisclosure } from "@chakra-ui/react";

import { useRestaurantDetail } from "../../hooks/useRestaurantDetail";
import { useAffectations } from "../../hooks/useAffectations";
import {useMemo, useState} from "react";

export default function RestaurantDetailPage() {
    const { id } = useParams();

    const { restaurant, loading } = useRestaurantDetail(id);
    const { data: affectations, addAffectation } = useAffectations(id);

    const [jobFilter, setJobFilter] = useState("");
    const [lastNameFilter, setLastNameFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();

    const filteredAffectations = useMemo(() => {
        if (!affectations) return [];

        return affectations.filter((a) => {
            const matchJob =
                jobFilter === "" ||
                a.jobTitle?.toLowerCase().includes(jobFilter.toLowerCase());

            const matchLastName =
                lastNameFilter === "" ||
                a.collaboratorLastName?.toLowerCase().includes(lastNameFilter.toLowerCase());

            const matchDate =
                dateFilter === "" ||
                a.startDateAffectation?.startsWith(dateFilter);

            return matchJob && matchLastName && matchDate;
        });
    }, [affectations, jobFilter, lastNameFilter, dateFilter]);

    const handleAssign = async (data) => {
        await addAffectation({
            collaboratorId: data.collaboratorId,
            restaurantId: Number(id),
            jobId: data.jobId,
            startDateAffectation: data.startDateAffectation,
        });

        onClose();
    };

    if (loading) {
        return (
            <Center h="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!restaurant) {
        return (
            <Center h="200px">
                <Text>Restaurant introuvable</Text>
            </Center>
        );
    }

    return (

        <Box p={6}>

            <Box p={5} borderWidth="1px" borderRadius="lg" mb={6}>
                <Heading size="md">
                    {restaurant.name}
                </Heading>
                <Text color="gray.600">{restaurant.city} • {restaurant.address}</Text>
            </Box>

            {/* FILTERS */}

            <Box
                p={4}
                mb={6}
                borderWidth="1px"
                borderRadius="lg"
                bg="gray.50"
            >

                <Stack direction={{ base: "column", md: "row" }} spacing={3}>
                    <Input
                        placeholder="Filtrer par poste"
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                    />

                    <Input
                        placeholder="Nom"
                        value={lastNameFilter}
                        onChange={(e) => setLastNameFilter(e.target.value)}
                    />

                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </Stack>
            </Box>


            <Button colorScheme="yellow" mb={6} onClick={onOpen}>
                Affecter un collaborateur
            </Button>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {filteredAffectations.map((a) => (
                    <Box key={a.id} p={4} borderWidth="1px" borderRadius="lg">
                        <Stack>
                            <Text fontWeight="bold">
                                {a.collaboratorFirstName} {a.collaboratorLastName}
                            </Text>

                            <Text fontSize="sm">{a.jobTitle}</Text>

                            <Text fontSize="sm" color="gray.500">
                                {a.startDateAffectation}
                            </Text>
                        </Stack>
                    </Box>
                ))}
            </SimpleGrid>

            {isOpen && (
                <Modal title="Affecter un collaborateur" onClose={onClose}>
                    <AssignCollaboratorForm onAssign={handleAssign} />
                </Modal>
            )}
        </Box>
    );
}