package com.marion.wacdo.service;

import com.marion.wacdo.dto.AffectationCreateDTO;
import com.marion.wacdo.dto.AffectationDTO;
import com.marion.wacdo.entities.Affectation;
import com.marion.wacdo.repository.AffectationRepository;
import com.marion.wacdo.repository.CollaboratorRepository;
import com.marion.wacdo.repository.JobRepository;
import com.marion.wacdo.repository.RestaurantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;


@Service
@Transactional
public class AffectationServiceImpl implements AffectationService {

    private final AffectationRepository affectationRepository;
    private final CollaboratorRepository collaboratorRepository;
    private final RestaurantRepository restaurantRepository;
    private final JobRepository jobRepository;
    private final ModelMapper modelMapper;

    public AffectationServiceImpl(AffectationRepository affectationRepository,
                                  CollaboratorRepository collaboratorRepository,
                                  RestaurantRepository restaurantRepository,
                                  JobRepository jobRepository,
                                  ModelMapper modelMapper) {
        this.affectationRepository = affectationRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.restaurantRepository = restaurantRepository;
        this.jobRepository = jobRepository;
        this.modelMapper = modelMapper;
    }

    // --- Récupérer toutes les affectations ---
    @Override
    public List<AffectationDTO> getAll() {
        return affectationRepository.findAll().stream()
                .map(a -> modelMapper.map(a, AffectationDTO.class))
                .toList();
    }

    // --- Récupérer détail d'une affectation ---
    @Override
    public AffectationDTO getDetail(Long id) {
        Affectation a = affectationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affectation introuvable"));
        return modelMapper.map(a, AffectationDTO.class);
    }

    // --- Recherche avec filtres ---
    @Override
    public List<AffectationDTO> search(String jobTitle, LocalDate start, LocalDate end, String city) {
        return affectationRepository.search(jobTitle, start, end, city).stream()
                .map(a -> modelMapper.map(a, AffectationDTO.class))
                .toList();
    }

    // --- Affectations par collaborateur ---
    @Override
    public List<AffectationDTO> getByCollaborator(Long collaboratorId) {
        return affectationRepository.findByCollaborator(collaboratorId).stream()
                .map(a -> modelMapper.map(a, AffectationDTO.class))
                .toList();
    }

    // --- Affectations en cours par restaurant ---
    @Override
    public List<AffectationDTO> getCurrentByRestaurant(Long restaurantId) {
        return affectationRepository.findCurrentByRestaurant(restaurantId).stream()
                .map(a -> modelMapper.map(a, AffectationDTO.class))
                .toList();
    }

    // --- Création d'une affectation ---
    @Override
    public AffectationDTO create(AffectationCreateDTO dto) {

        var collaborator = collaboratorRepository.findById(dto.getCollaboratorId())
                .orElseThrow(() -> new RuntimeException("Collaborator not found"));

        var restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        var job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Vérifie qu'il n'y a pas déjà une affectation active
        if (affectationRepository.existsByCollaboratorIdAndEndDateAffectationIsNull(collaborator.getId())) {
            throw new RuntimeException("Collaborator already has an active assignment");
        }

        Affectation affectation = new Affectation();
        affectation.setCollaborator(collaborator);
        affectation.setRestaurant(restaurant);
        affectation.setJob(job);
        affectation.setStartDateAffectation(dto.getStartDateAffectation());
        affectation.setEndDateAffectation(dto.getEndDateAffectation());

        Affectation saved = affectationRepository.save(affectation);
        return modelMapper.map(saved, AffectationDTO.class);
    }

    // --- Modification d'une affectation ---
    @Override
    public AffectationDTO update(Long id, AffectationDTO dto) {
        Affectation existing = affectationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affectation not found"));

        if (dto.getCollaboratorId() != null) {
            var collaborator = collaboratorRepository.findById(dto.getCollaboratorId())
                    .orElseThrow(() -> new RuntimeException("Collaborator not found"));
            existing.setCollaborator(collaborator);
        }

        if (dto.getRestaurantId() != null) {
            var restaurant = restaurantRepository.findById(dto.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));
            existing.setRestaurant(restaurant);
        }

        if (dto.getJobId() != null) {
            var job = jobRepository.findById(dto.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            existing.setJob(job);
        }

        if (dto.getStartDateAffectation() != null) existing.setStartDateAffectation(dto.getStartDateAffectation());
        existing.setEndDateAffectation(dto.getEndDateAffectation());

        Affectation saved = affectationRepository.save(existing);
        return modelMapper.map(saved, AffectationDTO.class);
    }

    // --- Suppression d'une affectation ---
    @Override
    public void delete(Long id) {

        Affectation affectation = affectationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affectation introuvable avec l'id : " + id));

        affectationRepository.delete(affectation);
    }
}