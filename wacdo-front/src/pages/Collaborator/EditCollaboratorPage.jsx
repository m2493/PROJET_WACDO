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
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

const schema = Yup.object({
  firstName: Yup.string().required("Requis"),
  lastName: Yup.string().required("Requis"),
  email: Yup.string().email("Email invalide").required("Requis"),

  restaurantId: Yup.string().nullable(),
  jobId: Yup.string().nullable(),
  startDateAffectation: Yup.string().nullable(),
});

export default function EditCollaboratorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    restaurantId: "",
    jobId: "",
    startDateAffectation: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [cRes, rRes, jRes] = await Promise.all([
        api.get("/api/collaborators"),
        api.get("/api/restaurants"),
        api.get("/api/jobs"),
      ]);

      const collab = cRes.data.find((c) => c.id == id);

      setInitialValues({
        firstName: collab?.firstName || "",
        lastName: collab?.lastName || "",
        email: collab?.email || "",
        restaurantId: "",
        jobId: "",
        startDateAffectation: new Date().toISOString().split("T")[0],
      });

      setRestaurants(rRes.data);
      setJobs(jRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await api.put(`/api/collaborators/${id}`, values);

      if (values.restaurantId && values.jobId) {
        await api.post("/api/affectations", {
          collaboratorId: id,
          restaurantId: values.restaurantId,
          jobId: Number(values.jobId),
          startDateAffectation: values.startDateAffectation,
        });
      }

      toast({
        title: "Sauvegardé",
        status: "success",
        duration: 2000,
      });

      navigate(`/collaborators/${id}`);
    } catch (e) {
      toast({
        title: "Erreur",
        status: "error",
      });
    }
  };

  if (loading) {
    return (
        <Center h="200px">
          <Spinner />
        </Center>
    );
  }

  return (
      <Box maxW="3xl" mx="auto" p={6}>
        <Heading mb={6}>Modifier collaborateur</Heading>

        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            enableReinitialize
            onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, isValid }) => (
              <Form>
                <Stack spacing={6}>

                  {/* INFOS */}
                  <Stack spacing={3}>
                    {["lastName", "firstName", "email"].map((name) => (
                        <Field name={name} key={name}>
                          {({ field }) => (
                              <FormControl isInvalid={touched[name] && errors[name]}>
                                <Input {...field} placeholder={name} />
                                <FormErrorMessage>{errors[name]}</FormErrorMessage>
                              </FormControl>
                          )}
                        </Field>
                    ))}
                  </Stack>

                  {/* AFFECTATION */}
                  <Stack spacing={3}>
                    <Select
                        name="restaurantId"
                        value={values.restaurantId}
                        onChange={handleChange}
                        placeholder="Restaurant"
                    >
                      {restaurants.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                      ))}
                    </Select>

                    <Select
                        name="jobId"
                        value={values.jobId}
                        onChange={handleChange}
                        placeholder="Poste"
                    >
                      {jobs.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.labelFunction}
                          </option>
                      ))}
                    </Select>

                    <Input
                        type="date"
                        name="startDateAffectation"
                        value={values.startDateAffectation}
                        onChange={handleChange}
                    />
                  </Stack>

                  {/* ACTION */}
                  <Button
                      type="submit"
                      colorScheme="blue"
                      isDisabled={!isValid}
                  >
                    Enregistrer
                  </Button>

                </Stack>
              </Form>
          )}
        </Formik>
      </Box>
  );
}