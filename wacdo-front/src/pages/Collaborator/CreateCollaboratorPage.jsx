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

    password: Yup.string()
        .required("Le mot de passe est requis")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .matches(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
        .matches(/[a-z]/, "Le mot de passe doit contenir une minuscule")
        .matches(/[0-9]/, "Le mot de passe doit contenir un chiffre")
        .matches(
            /[^A-Za-z0-9]/,
            "Le mot de passe doit contenir un caractère spécial"
        ),
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