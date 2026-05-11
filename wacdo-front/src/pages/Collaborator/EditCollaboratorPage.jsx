import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

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
  SimpleGrid,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

const validationSchema = Yup.object({
  firstName: Yup.string()
      .strict(true)
      .trim()
      .required("Le prénom est requis")
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(50, "Le prénom est trop long")
      .matches(
          /^(?!\d+$).+/,
          "Le prénom ne peut pas contenir uniquement des chiffres"
      ),

  lastName: Yup.string()
      .strict(true)
      .trim()
      .required("Le nom est requis")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom est trop long")
      .matches(
          /^(?!\d+$).+/,
          "Le nom ne peut pas contenir uniquement des chiffres"
      ),

  email: Yup.string()
      .strict(true)
      .trim()
      .lowercase()
      .required("L'email est requis")
      .email("Adresse email invalide"),
});

export default function EditCollaboratorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
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
        setInitialValues({
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

  function handleAffectationChange(e) {
    setAffectation({
      ...affectation,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(values) {
    try {
      await api.put(`/api/collaborators/${id}`, values);

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

        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            validateOnMount
            onSubmit={handleSubmit}
        >
          {({
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <Form>
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
                      <Field name="lastName">
                        {({ field }) => (
                            <FormControl
                                isInvalid={
                                    touched.lastName &&
                                    errors.lastName
                                }
                            >
                              <Input
                                  {...field}
                                  placeholder="Nom"
                              />
                              <FormErrorMessage>
                                {errors.lastName}
                              </FormErrorMessage>
                            </FormControl>
                        )}
                      </Field>

                      <Field name="firstName">
                        {({ field }) => (
                            <FormControl
                                isInvalid={
                                    touched.firstName &&
                                    errors.firstName
                                }
                            >
                              <Input
                                  {...field}
                                  placeholder="Prénom"
                              />
                              <FormErrorMessage>
                                {errors.firstName}
                              </FormErrorMessage>
                            </FormControl>
                        )}
                      </Field>

                      <Field name="email">
                        {({ field }) => (
                            <FormControl
                                isInvalid={
                                    touched.email &&
                                    errors.email
                                }
                            >
                              <Input
                                  {...field}
                                  placeholder="Email"
                              />
                              <FormErrorMessage>
                                {errors.email}
                              </FormErrorMessage>
                            </FormControl>
                        )}
                      </Field>
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
                            <option
                                key={job.id}
                                value={job.id}
                            >
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
                        isDisabled={!isValid || !dirty}
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
              </Form>
          )}
        </Formik>
      </Box>
  );
}