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

export default function CreateFunctionPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const initialValues = {
    labelFunction: "",
  };

  const validationSchema = Yup.object({
    labelFunction: Yup.string().required("Le libellé est requis"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await api.post("/api/jobs", values);

      toast({
        title: "Fonction créée",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/function");
    } catch (err) {
      console.error(err);

      toast({
        title: "Erreur",
        description: "Impossible de créer la fonction",
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
          Créer une fonction
        </Heading>

        {/* FORM CARD */}
        <Box
            bg="white"
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            shadow="sm"
        >
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
                <Form>
                  <Stack spacing={4}>
                    <FormInput
                        name="labelFunction"
                        label="Libellé de la fonction"
                    />

                    <Stack direction="row" justify="flex-end" spacing={3}>
                      <Button
                          variant="outline"
                          onClick={() => navigate("/function")}
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