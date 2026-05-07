import {
    Box,
    Flex,
    HStack,
    Button,
    Text,
    Spacer
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { logout, isAuthenticated, user } = useContext(AuthContext);
    const isAdmin = user?.admin;

    // 🔐 PAS ADMIN → PAS DE NAVBAR
    if (!isAuthenticated || !isAdmin) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Box bg="white" px={6} py={4} shadow="sm">
            <Flex align="center">

                <HStack spacing={6}>
                    <NavLink to="/collaborator">Collaborateurs</NavLink>
                    <NavLink to="/function">Fonctions</NavLink>
                    <NavLink to="/restaurant">Restaurants</NavLink>
                    <NavLink to="/affectation">Affectations</NavLink>
                </HStack>

                <Spacer />

                <HStack spacing={4}>
                    <Text fontWeight="medium">
                        Bonjour {user?.lastName} {user?.firstName}
                    </Text>

                    <Button colorScheme="red" size="sm" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </HStack>

            </Flex>
        </Box>
    );
}

export default Navbar;