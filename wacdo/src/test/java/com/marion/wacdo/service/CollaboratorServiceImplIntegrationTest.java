package com.marion.wacdo.service;

import com.marion.wacdo.dto.CollaboratorCreateDTO;
import com.marion.wacdo.dto.CollaboratorDTO;
import com.marion.wacdo.entities.Collaborator;
import com.marion.wacdo.repository.CollaboratorRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CollaboratorServiceImplIntegrationTest {

    @Autowired
    private CollaboratorService collaboratorService;

    @Autowired
    private CollaboratorRepository collaboratorRepository;

    private Collaborator collaborator1;
    private Collaborator collaborator2;

    @BeforeEach
    void setUp() {
        collaboratorRepository.deleteAll();

        collaborator1 = createCollaborator("Jean", "Dupont", "jean@test.com");
        collaborator2 = createCollaborator("Marie", "Martin", "marie@test.com");
    }

    private Collaborator createCollaborator(String firstname, String lastname, String email) {
        Collaborator collaborator = new Collaborator();
        collaborator.setFirstName(firstname);
        collaborator.setLastName(lastname);
        collaborator.setEmail(email);
        collaborator.setPassword("password");

        Collaborator saved = collaboratorRepository.save(collaborator);
        assertNotNull(saved.getId(), "L'ID doit être généré par H2");
        return saved;
    }

    @Test
    void shouldCreateCollaborator() {

        // GIVEN
        CollaboratorCreateDTO dto = new CollaboratorCreateDTO();
        dto.setFirstName("Paul");
        dto.setLastName("Durand");
        dto.setEmail("paul@test.com");
        dto.setPassword("1234");

        // WHEN
        CollaboratorCreateDTO result = collaboratorService.create(dto);

        // THEN
        assertNotNull(result);
        assertEquals("Paul", result.getFirstName());

        List<Collaborator> collaborators = collaboratorRepository.findAll();
        assertEquals(3, collaborators.size());
    }

    @Test
    void shouldUpdateCollaborator() {

        CollaboratorDTO dto = new CollaboratorDTO();
        dto.setFirstName("Pierre");
        dto.setLastName(collaborator1.getLastName());
        dto.setId(collaborator1.getId());
        System.out.println(collaborator1.getId());
        System.out.println(dto.getId());
        CollaboratorDTO updated =
                collaboratorService.update(collaborator1.getId(), dto);

        assertEquals("Pierre", updated.getFirstName());

        Collaborator entity =
                collaboratorRepository.findById(collaborator1.getId()).orElseThrow();

        assertEquals("Pierre", entity.getFirstName());
    }

    @Test
    void shouldDeleteCollaborator() {

        // WHEN
        collaboratorService.delete(collaborator1.getId());

        // THEN
        assertFalse(collaboratorRepository.existsById(collaborator1.getId()));
    }

    @Test
    void shouldThrowExceptionWhenDeletingUnknownCollaborator() {

        assertThrows(RuntimeException.class, () -> {
            collaboratorService.delete(999L);
        });
    }

    @Test
    void shouldFilterByLastname() {

        // WHEN
        List<CollaboratorDTO> result =
                collaboratorService.listerFiltrer("Dupont", null, null);

        // THEN
        assertEquals(1, result.size());
        assertEquals("Dupont", result.get(0).getLastName());
    }

    @Test
    void shouldReturnNonAssignedCollaborators() {

        // WHEN
        List<CollaboratorDTO> result =
                collaboratorService.getCollaboratorsNonAffectes();

        // THEN
        assertEquals(2, result.size());
    }
}
