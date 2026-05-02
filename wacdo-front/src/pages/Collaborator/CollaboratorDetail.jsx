import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import {
  Box,
  Heading,
  Text,
  Input,
  Stack,
  Button,
  Spinner,
  Center,
  SimpleGrid,
  Badge,
  HStack,
} from "@chakra-ui/react";

export default function CollaboratorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collaborator, setCollaborator] = useState(null);
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [jobFilter, setJobFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const collabRes = await api.get("/api/collaborators");
      const collab = collabRes.data.find((c) => c.id == id);

      const affRes = await api.get(
          `/api/affectations/collaborator/${id}`
      );

      setCollaborator(collab);
      setAffectations(affRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
        <Center h="200px">
          <Spinner size="xl" />
        </Center>
    );
  }

  if (!collaborator) {
    return (
        <Center h="200px">
          <Text>Collaborateur introuvable</Text>
        </Center>
    );
  }

  const filtered = affectations.filter((a) => {
    const matchJob =
        jobFilter === "" ||
        a.jobTitle?.toLowerCase().includes(jobFilter.toLowerCase());

    const matchDate =
        dateFilter === "" || a.startDateAffectation === dateFilter;

    return matchJob && matchDate;
  });

  const today = new Date().toISOString().split("T")[0];

  const current = filtered.filter(
      (a) =>
          !a.endDateAffectation ||
          a.endDateAffectation >= today
  );

  const history = filtered.filter(
      (a) =>
          a.endDateAffectation &&
          a.endDateAffectation < today
  );

  return (
      <Box p={6}>
        {/* HEADER COLLAB */}
        <Box
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            mb={6}
        >
          <Heading size="md">
            {collaborator.lastName} {collaborator.firstName}
          </Heading>

          <Text color="gray.600">{collaborator.email}</Text>
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
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
            />
          </Stack>
        </Box>

        {/* CURRENT */}
        <Box mb={8}>
          <Heading size="sm" mb={4}>
            Affectations en cours
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {current.map((a) => (
                <Box
                    key={a.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{a.jobTitle}</Text>

                    <Badge colorScheme="green">Actif</Badge>
                  </HStack>

                  <Text fontSize="sm" color="gray.600" mt={2}>
                    Début : {a.startDateAffectation}
                  </Text>

                  <Button
                      mt={3}
                      size="sm"
                      colorScheme="yellow"
                      onClick={() =>
                          navigate(`/affectations/${a.id}/edit`)
                      }
                  >
                    Modifier
                  </Button>
                </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* HISTORY */}
        <Box mb={8}>
          <Heading size="sm" mb={4}>
            Historique des affectations
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {history.map((a) => (
                <Box
                    key={a.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    opacity={0.8}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">{a.jobTitle}</Text>

                    <Badge colorScheme="gray">Terminé</Badge>
                  </HStack>

                  <Text fontSize="sm" color="gray.600" mt={2}>
                    Du {a.startDateAffectation} au{" "}
                    {a.endDateAffectation}
                  </Text>

                  <Button
                      mt={3}
                      size="sm"
                      colorScheme="yellow"
                      onClick={() =>
                          navigate(`/affectations/${a.id}/edit`)
                      }
                  >
                    Modifier
                  </Button>
                </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* ACTION */}
        <Box display="flex" justifyContent="flex-end">
          <Button
              colorScheme="blue"
              onClick={() =>
                  navigate(`/collaborators/${id}/edit`)
              }
          >
            Affecter un nouveau poste
          </Button>
        </Box>
      </Box>
  );
}