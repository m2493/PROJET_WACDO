import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/forms/FormInput";

import {
  Box,
  Heading,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";

const noOnlyNumbers = (field) =>
    Yup.string()
        .required(`${field} est requis`)
        .min(2, `${field} doit contenir au moins 2 caractères`)
        .matches(/^(?!\d+$).+/, `${field} ne peut pas être uniquement des chiffres`);

const validationSchema = Yup.object({
  name: noOnlyNumbers("Le nom"),
  address: noOnlyNumbers("L'adresse"),
  city: noOnlyNumbers("La ville"),
  postalCode: Yup.string()
      .required("Le code postal est requis")
      .matches(/^[0-9]{5}$/, "Code postal invalide"),
});

export default function CreateRestaurantPage() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    address: "",
    city: "",
    postalCode: "",
  };

  const handleSubmit = async (values) => {
    try {
      await api.post("/api/restaurants", values);
      navigate("/restaurants");
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <Box maxW="xl" mx="auto" p={6}>
        {/* HEADER */}
        <Heading size="lg" mb={6}>
          Créer un restaurant
        </Heading>

        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
          <Form>
            <VStack spacing={4} align="stretch">
              <FormInput name="name" label="Nom du restaurant" />
              <FormInput name="city" label="Ville" />
              <FormInput name="address" label="Adresse" />
              <FormInput name="postalCode" label="Code postal" />

              {/* ACTIONS */}
              <HStack justify="flex-end" pt={4}>
                <Button
                    variant="outline"
                    onClick={() => navigate("/restaurants")}
                >
                  Annuler
                </Button>

                <Button colorScheme="blue" type="submit">
                  Enregistrer
                </Button>
              </HStack>
            </VStack>
          </Form>
        </Formik>
      </Box>
  );
}