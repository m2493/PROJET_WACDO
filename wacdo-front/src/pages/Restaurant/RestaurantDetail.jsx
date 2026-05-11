import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

import {
  Box,
  Heading,
  Button,
  Text,
  Spinner,
  Center,
  Stack,
  Badge,
  SimpleGrid,
  Input,
} from "@chakra-ui/react";

import Modal from "../../components/Modal";
import AssignCollaboratorForm from "../../components/forms/AssignCollaboratorForm";

export default function RestaurantDetailPage() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [affectations, setAffectations] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    job: "",
    startDate: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    applyFilters();
  }, [filters, affectations]);

  const fetchData = async () => {
    try {
      const resRestaurant = await api.get(
          `/api/restaurants/${id}`
      );

      const resAffectations = await api.get(
          `/api/affectations/restaurant/${id}/current`
      );

      setRestaurant(resRestaurant.data);
      setAffectations(resAffectations.data);
      setFiltered(resAffectations.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function applyFilters() {
    let result = [...affectations];

    if (filters.name) {
      result = result.filter((a) =>
          `${a.collaboratorFirstName} ${a.collaboratorLastName}`
              .toLowerCase()
              .includes(filters.name.toLowerCase())
      );
    }

    if (filters.job) {
      result = result.filter((a) =>
          a.jobTitle
              .toLowerCase()
              .includes(filters.job.toLowerCase())
      );
    }

    if (filters.startDate) {
      result = result.filter((a) =>
          a.startDateAffectation
              ?.includes(filters.startDate)
      );
    }

    setFiltered(result);
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleAssign = async (data) => {
    try {
      await api.post("/api/affectations", {
        collaboratorId: data.collaboratorId,
        restaurantId: Number(id),
        jobId: data.jobId,
        startDateAffectation:
        data.startDateAffectation,
      });

      setIsOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
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
        {/* HEADER */}
        <Heading size="lg" mb={1}>
          {restaurant.name}
        </Heading>

        <Text color="gray.600" mb={6}>
          {restaurant.city} • {restaurant.address}
        </Text>

        {/* ACTION */}
        <Button
            colorScheme="yellow"
            mb={6}
            onClick={() => setIsOpen(true)}
        >
          Affecter
        </Button>

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
                placeholder="Nom collaborateur"
                value={filters.name}
                onChange={(e) =>
                    setFilters({
                      ...filters,
                      name: e.target.value,
                    })
                }
            />

            <Input
                placeholder="Poste"
                value={filters.job}
                onChange={(e) =>
                    setFilters({
                      ...filters,
                      job: e.target.value,
                    })
                }
            />

            <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                    setFilters({
                      ...filters,
                      startDate: e.target.value,
                    })
                }
            />
          </Stack>
        </Box>

        {/* LIST */}
        {filtered.length === 0 ? (
            <Center
                p={10}
                borderWidth="1px"
                borderRadius="lg"
            >
              <Text>
                Aucune affectation à afficher
              </Text>
            </Center>
        ) : (
            <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing={4}
            >
              {filtered.map((a) => (
                  <Box
                      key={a.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                  >
                    <Stack spacing={1}>
                      <Text fontWeight="bold">
                        {a.collaboratorFirstName}{" "}
                        {a.collaboratorLastName}
                      </Text>

                      <Text fontSize="sm" color="gray.600">
                        {a.jobTitle}
                      </Text>

                      <Text fontSize="sm" color="gray.500">
                        {a.startDateAffectation}
                        {a.endDateAffectation && (
                            <> → {a.endDateAffectation}</>
                        )}
                      </Text>

                      <Badge colorScheme="green">
                        Actif
                      </Badge>
                    </Stack>
                  </Box>
              ))}
            </SimpleGrid>
        )}

        {/* MODAL */}
        {isOpen && (
            <Modal
                title="Affecter un collaborateur"
                onClose={() => setIsOpen(false)}
            >
              <AssignCollaboratorForm
                  onAssign={handleAssign}
              />
            </Modal>
        )}
      </Box>
  );
}