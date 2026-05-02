import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ListWithFilter from "../../components/ListWithFilter";

import {
  Box,
  Heading,
  Button,
  Stack,
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

export default function FunctionsListPage() {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [labelFunction, setLabelFunction] = useState("");
  const [saving, setSaving] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFunctions();
  }, []);

  async function fetchFunctions() {
    try {
      const res = await api.get("/api/jobs");
      setFunctions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(item) {
    setSelectedItem(item);
    setLabelFunction(item.labelFunction);
    onOpen();
  }

  function closeModal() {
    onClose();
    setSelectedItem(null);
    setLabelFunction("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!labelFunction.trim()) return;

    try {
      setSaving(true);

      const res = await api.put(`/api/jobs/${selectedItem.id}`, {
        id: selectedItem.id,
        labelFunction,
      });

      const updated = res.data;

      setFunctions((prev) =>
          prev.map((item) =>
              item.id === updated.id ? updated : item
          )
      );

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  }

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Liste des fonctions</Heading>

          <Button
              colorScheme="blue"
              onClick={() => navigate("/function/create")}
          >
            Créer une fonction
          </Button>
        </Box>

        {/* LISTE */}
        <ListWithFilter
            items={functions}
            renderItem={(item) => (
                <Box key={item.id} mb={4}>
                  <Box
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      shadow="sm"
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
                </Box>
            )}
        />

        {/* MODAL */}
        <Modal isOpen={isOpen} onClose={closeModal} isCentered>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>Modifier la fonction</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Stack spacing={3}>
                <Text>Libellé</Text>
                <Input
                    value={labelFunction}
                    onChange={(e) => setLabelFunction(e.target.value)}
                    placeholder="Ex: Manager"
                />
              </Stack>
            </ModalBody>

            <ModalFooter gap={2}>
              <Button variant="ghost" onClick={closeModal}>
                Annuler
              </Button>

              <Button
                  colorScheme="green"
                  onClick={handleSubmit}
                  isLoading={saving}
              >
                Sauvegarder
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
  );
}