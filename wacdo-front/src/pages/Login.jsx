import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    Text,
    VStack,
    Alert,
    AlertIcon,
    useToast
} from "@chakra-ui/react";

function Login() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [error, setError] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !motDePasse) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        try {
            await login(email, motDePasse);

            toast({
                title: "Connexion réussie",
                status: "success",
                duration: 2000,
                isClosable: true,
            });

            navigate("/restaurant");
        } catch (error) {

            if (error.message === "NOT_ADMIN") {

                toast({
                    title: "Accès refusé",
                    description: "Utilisateur non administrateur",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });

                return;
            }

            setError("Identifiants incorrects");
        }
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.50"
        >
            <Box
                w="full"
                maxW="400px"
                bg="white"
                p={8}
                borderRadius="xl"
                boxShadow="lg"
            >
                <VStack spacing={6} align="stretch">

                    <Heading textAlign="center" size="lg">
                        Portail Administrateur Wacdo
                    </Heading>

                    <Text textAlign="center" color="gray.500">
                        Identifiants pour tester l'application EMAIL : johndoe@gmail.com, MDP : test
                    </Text>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>

                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="ex: admin@mail.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Mot de passe</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={(e) => setMotDePasse(e.target.value)}
                                />
                            </FormControl>

                            {error && (
                                <Alert status="error" borderRadius="md">
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                colorScheme="blue"
                                width="full"
                            >
                                Connexion
                            </Button>

                        </VStack>
                    </form>

                </VStack>
            </Box>
        </Box>
    );
}

export default Login;