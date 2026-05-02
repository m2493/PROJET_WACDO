import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";

export default function FormInput({ label, ...props }) {
    const [field, meta] = useField(props);

    return (
        <FormControl
            isInvalid={meta.touched && meta.error}
        >
            {label && (
                <FormLabel color="gray.700" fontWeight="medium">
                    {label}
                </FormLabel>
            )}

            <Input
                {...field}
                {...props}
                focusBorderColor="blue.500"
                bg="white"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                size="md"
            />

            {meta.touched && meta.error && (
                <FormErrorMessage>
                    {meta.error}
                </FormErrorMessage>
            )}
        </FormControl>
    );
}