import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/forms/FormInput";

export default function CreateCollaboratorPage() {
  const navigate = useNavigate();

  const initialValues = {
    lastName: "",
    firstName: "",
    email: "",
    password: ""
      };

  const validationSchema = Yup.object({
    lastName: Yup.string().required("Le nom est requis"),
    firstName: Yup.string().required("Le prénom est requis"),
    email: Yup.string().required("L'email est requis"),
    password: Yup.string().required("Le mot de passe est requis"),
    
  });

  const handleSubmit = async (values) => {
    try {
      await api.post("/api/collaborators", values);
      navigate("/collaborators"); // retour à la liste
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Créer un collaborateur</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="bg-white shadow rounded p-6">
          <FormInput name="lastName" label="Nom " />
          <FormInput name="firstName" label="Prénom" />
          <FormInput name="email" label="Email" />
          <FormInput name="password" label="Mot de passe" />
          

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/collaborators")}
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