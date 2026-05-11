import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/forms/FormInput";

export default function CreateRestaurantPage() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    address: "",
    city: "",
    postalCode : ""

  };

  const validationSchema = Yup.object({
    name: Yup.string()
        .strict(true)
        .required("Le nom est requis")
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .matches(
        /^(?!\d+$).+/,
        "Le nom ne peut pas contenir uniquement des chiffres"
    ),
    address: Yup.string()
        .strict(true)
        .required("L'adresse est requise")
        .min(2, "L'adresse doit contenir au moins 2 caractères")
        .matches(
        /^(?!\d+$).+/,
        "L'adresse ne peut pas contenir uniquement des chiffres"
    ),
    city: Yup.string()
        .strict(true)
        .required("La ville est requise")
        .matches(
        /^(?!\d+$).+/,
        "L'adresse ne peut pas contenir uniquement des chiffres"),
    postalCode: Yup.string()
        .required("Le code postal est requis")
        .matches(
            /^[0-9]{5}(?:[0-9]{3})?$/,
            {
              message: "Code postal invalide",
              excludeEmptyString: true,
            }
        )
  });

  const handleSubmit = async (values) => {
    try {
      await api.post("/api/restaurants", values);
      navigate("/restaurants"); // retour à la liste
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">Créer un restaurant</h1>

        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
          <Form className="bg-white shadow rounded p-6">
            <FormInput name="name" label="Nom du restaurant" />
            <FormInput name="city" label="Ville" />
            <FormInput name="address" label="Adresse" />
            <FormInput name="postalCode" label="Code postal" />

            <div className="flex justify-end gap-2 mt-4">
              <button
                  type="button"
                  onClick={() => navigate("/restaurants")}
                  className="px-4 py-2 border rounded"
              >
                Annuler
              </button>

              <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </Form>
        </Formik>
      </div>
  );
}