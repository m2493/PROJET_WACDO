package com.marion.wacdo.service;

import com.marion.wacdo.dto.AffectationCreateDTO;
import com.marion.wacdo.dto.AffectationDTO;

import java.time.LocalDate;
import java.util.List;

public interface AffectationService {


    // Récupérer toutes les affectations
    List<AffectationDTO> getAll();

    // Détail d’une affectation
    AffectationDTO getDetail(Long id);

    // Recherche avec filtres
    List<AffectationDTO> search(String jobTitle, LocalDate start, LocalDate end, String city);

    // Affectations d’un collaborateur
    List<AffectationDTO> getByCollaborator(Long collaboratorId);

    // Affectations en cours d’un restaurant
    List<AffectationDTO> getCurrentByRestaurant(Long restaurantId);

    // Créer une nouvelle affectation
    AffectationDTO create(AffectationCreateDTO dto);

    // Mettre à jour une affectation
    AffectationDTO update(Long id, AffectationDTO dto);

    void delete(Long id);

}
