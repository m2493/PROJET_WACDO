import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Heading,
  Button,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import { useJobs } from "../../hooks/useJobs";

export default function FunctionsListPage() {
  const { data: functions, loading, updateJob } = useJobs();

  const [selectedItem, setSelectedItem] = useState(null);
  const [labelFunction, setLabelFunction] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const openEditModal = (item) => {
    setSelectedItem(item);
    setLabelFunction(item.labelFunction);
    onOpen();
  };

  const closeModal = () => {
    setSelectedItem(null);
    setLabelFunction("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!labelFunction.trim()) return;

    await updateJob(selectedItem.id, {
      labelFunction,
    });

    closeModal();
  };

  if (loading) {
    return (
        <Box p={6}>
          <Text>Chargement...</Text>
        </Box>
    );
  }

  return (
      <Box p={6}>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" mb={6}>
          <Heading size="lg">Liste des fonctions</Heading>

          <Button
              colorScheme="blue"
              onClick={() => navigate("/function/create")}
          >
            Créer une fonction
          </Button>
        </Box>

        {/* LISTE */}
        {functions.map((item) => (
            <Box
                key={item.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                mb={4}
            >
              <Text fontWeight="bold">{item.labelFunction}</Text>

              <Button
                  mt={3}
                  size="sm"
                  colorScheme="yellow"
                  onClick={() => openEditModal(item)}
              >
                Modifier
              </Button>
            </Box>
        ))}

        {/* MODAL */}
        <Modal isOpen={isOpen} onClose={closeModal} isCentered>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>Modifier la fonction</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Input
                  value={labelFunction}
                  onChange={(e) => setLabelFunction(e.target.value)}
                  placeholder="Ex: Manager"
              />
            </ModalBody>

            <ModalFooter gap={2}>
              <Button variant="ghost" onClick={closeModal}>
                Annuler
              </Button>

              <Button colorScheme="green" onClick={handleSubmit}>
                Sauvegarder
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
  );
}