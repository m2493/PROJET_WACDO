import { useEffect, useState } from "react";
import api from "../api/axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
    VStack,
    FormControl,
    FormLabel,
    Select,
    Input,
    Button,
    Spinner,
    Center,
} from "@chakra-ui/react";

const validationSchema = Yup.object({
    collaboratorId: Yup.number().required("Collaborateur requis"),
    jobId: Yup.number().required("Poste requis"),
    startDate: Yup.string().required("Date requise"),
});

export default function AssignCollaboratorForm({ onAssign }) {
    const [collaborators, setCollaborators] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const resC = await api.get("/api/collaborators/non-affectes");
            const resJ = await api.get("/api/jobs");

            setCollaborators(resC.data);
            setJobs(resJ.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const initialValues = {
        collaboratorId: "",
        jobId: "",
        startDate: new Date().toISOString().split("T")[0],
    };

    const handleSubmit = (values) => {
        onAssign({
            collaboratorId: Number(values.collaboratorId),
            jobId: Number(values.jobId),
            startDate: values.startDate,
        });
    };

    if (loading) {
        return (
            <Center py={10}>
                <Spinner />
            </Center>
        );
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange }) => (
                <Form>
                    <VStack spacing={5} align="stretch">

                        {/* COLLABORATEUR */}
                        <FormControl isRequired>
                            <FormLabel>Collaborateur</FormLabel>
                            <Select
                                name="collaboratorId"
                                value={values.collaboratorId}
                                onChange={handleChange}
                                placeholder="Sélectionner un collaborateur"
                            >
                                {collaborators.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.firstName} {c.lastName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        {/* POSTE */}
                        <FormControl isRequired>
                            <FormLabel>Poste</FormLabel>
                            <Select
                                name="jobId"
                                value={values.jobId}
                                onChange={handleChange}
                                placeholder="Sélectionner un poste"
                            >
                                {jobs.map((j) => (
                                    <option key={j.id} value={j.id}>
                                        {j.title}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        {/* DATE */}
                        <FormControl isRequired>
                            <FormLabel>Date de début</FormLabel>
                            <Input
                                type="date"
                                name="startDate"
                                value={values.startDate}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* SUBMIT */}
                        <Button colorScheme="green" type="submit" w="full">
                            Affecter
                        </Button>

                    </VStack>
                </Form>
            )}
        </Formik>
    );
}