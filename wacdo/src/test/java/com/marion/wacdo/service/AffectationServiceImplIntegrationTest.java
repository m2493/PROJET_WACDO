package com.marion.wacdo.service;

import com.marion.wacdo.dto.AffectationCreateDTO;
import com.marion.wacdo.dto.AffectationDTO;
import com.marion.wacdo.entities.Affectation;
import com.marion.wacdo.entities.Collaborator;
import com.marion.wacdo.entities.Job;
import com.marion.wacdo.entities.Restaurant;
import com.marion.wacdo.repository.AffectationRepository;
import com.marion.wacdo.repository.CollaboratorRepository;
import com.marion.wacdo.repository.JobRepository;
import com.marion.wacdo.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AffectationServiceImplIntegrationTest {

    @Autowired
    private AffectationService affectationService;

    @Autowired
    private AffectationRepository affectationRepository;

    @Autowired
    private CollaboratorRepository collaboratorRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private JobRepository jobRepository;

    private Collaborator collaborator;
    private Restaurant restaurant;
    private Job job;
    private Affectation affectation;

    @BeforeEach
    void setUp() {

        affectationRepository.deleteAll();
        collaboratorRepository.deleteAll();
        restaurantRepository.deleteAll();
        jobRepository.deleteAll();

        collaborator = createCollaborator();
        restaurant = createRestaurant();
        job = createJob();

        affectation = createAffectation();
    }

    private Collaborator createCollaborator() {

        Collaborator c = new Collaborator();

        c.setFirstName("Jean");
        c.setLastName("Dupont");
        c.setEmail("jean@test.com");
        c.setPassword("password");

        return collaboratorRepository.save(c);
    }

    private Restaurant createRestaurant() {

        Restaurant r = new Restaurant();

        r.setName("McDo Niort");
        r.setCity("Niort");
        r.setPostalCode("79000");

        return restaurantRepository.save(r);
    }

    private Job createJob() {

        Job j = new Job();

        j.setLabelFunction("Serveur");

        return jobRepository.save(j);
    }

    private Affectation createAffectation() {

        Affectation a = new Affectation();

        a.setCollaborator(collaborator);
        a.setRestaurant(restaurant);
        a.setJob(job);
        a.setStartDateAffectation(LocalDate.now());

        return affectationRepository.save(a);
    }

    @Test
    void shouldReturnAllAffectations() {


        List<AffectationDTO> result = affectationService.getAll();


        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnAffectationDetail() {


        AffectationDTO result =
                affectationService.getDetail(affectation.getId());


        assertNotNull(result);
        assertEquals(collaborator.getId(), result.getCollaboratorId());
    }

    @Test
    void shouldCreateAffectation() {


        Collaborator collaborator2 = new Collaborator();

        collaborator2.setFirstName("Marie");
        collaborator2.setLastName("Martin");
        collaborator2.setEmail("marie@test.com");
        collaborator2.setPassword("password");

        collaborator2 = collaboratorRepository.save(collaborator2);

        AffectationCreateDTO dto = new AffectationCreateDTO();

        dto.setCollaboratorId(collaborator2.getId());
        dto.setRestaurantId(restaurant.getId());
        dto.setJobId(job.getId());
        dto.setStartDateAffectation(LocalDate.now());


        AffectationDTO result = affectationService.create(dto);


        assertNotNull(result);

        List<Affectation> affectations =
                affectationRepository.findAll();

        assertEquals(2, affectations.size());
    }

    @Test
    void shouldThrowExceptionWhenDuplicateAffectation() {


        AffectationCreateDTO dto = new AffectationCreateDTO();

        dto.setCollaboratorId(collaborator.getId());
        dto.setRestaurantId(restaurant.getId());
        dto.setJobId(job.getId());
        dto.setStartDateAffectation(LocalDate.now());


        assertThrows(RuntimeException.class, () -> {
            affectationService.create(dto);
        });
    }

    @Test
    void shouldUpdateAffectation() {


        AffectationDTO dto = new AffectationDTO();

        dto.setEndDateAffectation(LocalDate.now().plusDays(10));


        AffectationDTO updated =
                affectationService.update(affectation.getId(), dto);


        assertNotNull(updated);
        assertEquals(
                LocalDate.now().plusDays(10),
                updated.getEndDateAffectation()
        );
    }

    @Test
    void shouldDeleteAffectation() {


        affectationService.delete(affectation.getId());


        assertFalse(
                affectationRepository.existsById(affectation.getId())
        );
    }

    @Test
    void shouldThrowExceptionWhenDeletingUnknownAffectation() {

        assertThrows(RuntimeException.class, () -> {
            affectationService.delete(999L);
        });
    }

    @Test
    void shouldSearchByCity() {


        List<AffectationDTO> result =
                affectationService.search(
                        null,
                        null,
                        null,
                        "Niort"
                );


        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnAffectationsByCollaborator() {


        List<AffectationDTO> result =
                affectationService.getByCollaborator(
                        collaborator.getId()
                );


        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnCurrentAffectationsByRestaurant() {


        List<AffectationDTO> result =
                affectationService.getCurrentByRestaurant(
                        restaurant.getId()
                );


        assertEquals(1, result.size());
    }
}