import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import {
  Box,
  Heading,
  Input,
  Select,
  Button,
  Stack,
  Spinner,
  Center,
  Text,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";

export default function EditCollaboratorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [affectation, setAffectation] = useState({
    restaurantId: "",
    jobId: "",
    startDateAffectation: "",
  });

  const [restaurants, setRestaurants] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const collabRes = await api.get("/api/collaborators");
      const collab = collabRes.data.find((c) => c.id == id);

      const restRes = await api.get("/api/restaurants");
      const jobsRes = await api.get("/api/jobs");

      if (collab) {
        setForm({
          firstName: collab.firstName || "",
          lastName: collab.lastName || "",
          email: collab.email || "",
        });
      }

      setRestaurants(restRes.data);
      setJobTitles(jobsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleAffectationChange(e) {
    setAffectation({
      ...affectation,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put(`/api/collaborators/${id}`, form);

      if (
          affectation.restaurantId &&
          affectation.jobId &&
          affectation.startDateAffectation
      ) {
        await api.post("/api/affectations", {
          collaboratorId: id,
          restaurantId: affectation.restaurantId,
          jobId: Number(affectation.jobId),
          startDateAffectation:
          affectation.startDateAffectation,
        });
      }

      toast({
        title: "Modifications enregistrées",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate(`/collaborators/${id}`);
    } catch (err) {
      console.error(err);

      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  if (loading) {
    return (
        <Center h="200px">
          <Spinner size="xl" />
        </Center>
    );
  }

  return (
      <Box maxW="3xl" mx="auto" p={6}>
        <Heading size="lg" mb={6}>
          Modifier collaborateur
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            {/* INFOS COLLAB */}
            <Box
                p={5}
                borderWidth="1px"
                borderRadius="lg"
            >
              <Heading size="sm" mb={4}>
                Informations collaborateur
              </Heading>

              <Stack spacing={3}>
                <Input
                    name="lastName"
                    placeholder="Nom"
                    value={form.lastName}
                    onChange={handleChange}
                />

                <Input
                    name="firstName"
                    placeholder="Prénom"
                    value={form.firstName}
                    onChange={handleChange}
                />

                <Input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
              </Stack>
            </Box>

            {/* AFFECTATION */}
            <Box
                p={5}
                borderWidth="1px"
                borderRadius="lg"
            >
              <Heading size="sm" mb={4}>
                Nouvelle affectation
              </Heading>

              <Stack spacing={3}>
                <Select
                    name="restaurantId"
                    value={affectation.restaurantId}
                    onChange={handleAffectationChange}
                    placeholder="Choisir un restaurant"
                >
                  {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                  ))}
                </Select>

                <Select
                    name="jobId"
                    value={affectation.jobId}
                    onChange={handleAffectationChange}
                    placeholder="Choisir un poste"
                >
                  {jobTitles.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.labelFunction}
                      </option>
                  ))}
                </Select>

                <Input
                    type="date"
                    name="startDateAffectation"
                    value={
                      affectation.startDateAffectation
                    }
                    onChange={handleAffectationChange}
                />
              </Stack>
            </Box>

            {/* ACTIONS */}
            <SimpleGrid columns={2} spacing={3}>
              <Button
                  type="submit"
                  colorScheme="blue"
              >
                Enregistrer
              </Button>

              <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
            </SimpleGrid>
          </Stack>
        </form>
      </Box>
  );
}