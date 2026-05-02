import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Heading,
  Button,
  Stack,
  useToast,
} from "@chakra-ui/react";

import FormInput from "../../components/forms/FormInput";

export default function CreateCollaboratorPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const initialValues = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    lastName: Yup.string().required("Le nom est requis"),
    firstName: Yup.string().required("Le prénom est requis"),
    email: Yup.string().required("L'email est requis"),
    password: Yup.string().required("Le mot de passe est requis"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.post("/api/collaborators", values);

      toast({
        title: "Collaborateur créé",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/collaborators");
    } catch (err) {
      console.error(err);

      toast({
        title: "Erreur",
        description: "Impossible de créer le collaborateur",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <Box maxW="lg" mx="auto" p={6}>
        {/* HEADER */}
        <Heading size="lg" mb={6}>
          Créer un collaborateur
        </Heading>

        {/* FORM CARD */}
        <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            shadow="sm"
            bg="white"
        >
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
                <Form>
                  <Stack spacing={4}>
                    <FormInput name="lastName" label="Nom" />
                    <FormInput name="firstName" label="Prénom" />
                    <FormInput name="email" label="Email" />
                    <FormInput name="password" label="Mot de passe" />

                    <Stack direction="row" justify="flex-end" spacing={3}>
                      <Button
                          variant="outline"
                          onClick={() => navigate("/collaborators")}
                      >
                        Annuler
                      </Button>

                      <Button
                          type="submit"
                          colorScheme="blue"
                          isLoading={isSubmitting}
                      >
                        Enregistrer
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
            )}
          </Formik>
        </Box>
      </Box>
  );
}