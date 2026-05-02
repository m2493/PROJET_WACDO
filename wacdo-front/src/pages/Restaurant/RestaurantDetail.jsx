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
  useDisclosure,
} from "@chakra-ui/react";

import Modal from "../../components/Modal";
import AssignCollaboratorForm from "../../components/forms/AssignCollaboratorForm";

export default function RestaurantDetailPage() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [affectations, setAffectations] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchData();
  }, [id]);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    const res = await api.get("/api/affectations");

    setHistory(
        res.data.filter(
            (a) => a.restaurantId === Number(id)
        )
    );
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
    loadHistory();
  };

  const handleAssign = async (data) => {
    try {
      await api.post("/api/affectations", {
        collaboratorId: data.collaboratorId,
        restaurantId: Number(id),
        jobId: data.jobId,
        startDateAffectation:
        data.startDateAffectation,
      });

      onClose();
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

  const dataToShow = showHistory
      ? history
      : affectations;

  return (
      <Box p={6}>
        {/* HEADER */}
        <Heading size="lg" mb={1}>
          {restaurant.name}
        </Heading>

        <Text color="gray.600" mb={6}>
          {restaurant.city} • {restaurant.address}
        </Text>

        {/* ACTIONS */}
        <Stack direction="row" spacing={3} mb={6}>
          <Button colorScheme="yellow" onClick={onOpen}>
            Affecter
          </Button>

          <Button
              colorScheme={showHistory ? "blue" : "gray"}
              onClick={handleToggleHistory}
          >
            {showHistory
                ? "Voir actuel"
                : "Historique"}
          </Button>
        </Stack>

        {/* LIST */}
        {dataToShow.length === 0 ? (
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
              {dataToShow.map((a) => (
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
                        {a.startDateAffectation}{" "}
                        {a.endDateAffectation && (
                            <>
                              → {a.endDateAffectation}
                            </>
                        )}
                      </Text>

                      {showHistory ? (
                          <Badge colorScheme="gray">
                            Terminé
                          </Badge>
                      ) : (
                          <Badge colorScheme="green">
                            Actif
                          </Badge>
                      )}
                    </Stack>
                  </Box>
              ))}
            </SimpleGrid>
        )}

        {/* MODAL */}
        {isOpen && (
            <Modal
                title="Affecter un collaborateur"
                onClose={onClose}
            >
              <AssignCollaboratorForm
                  onAssign={handleAssign}
              />
            </Modal>
        )}
      </Box>
  );
}