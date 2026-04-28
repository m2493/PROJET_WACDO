import { Formik, Form } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/forms/FormInput";

export default function CreateFunctionPage() {
  const navigate = useNavigate();

  const initialValues = {
    labelFunction: ""
    };

  const validationSchema = Yup.object({
    labelFunction: Yup.string().required("Le libellé est requis")  });

  const handleSubmit = async (values) => {
    try {
      await api.post("/api/jobs", values);
      navigate("/function"); // retour à la liste
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Créer une fonction</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="bg-white shadow rounded p-6">
          <FormInput name="labelFunction" label="Libellé de la fonction" />
          
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/functions")}
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