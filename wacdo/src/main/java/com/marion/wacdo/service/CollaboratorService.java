package com.marion.wacdo.service;

import com.marion.wacdo.dto.*;
import com.marion.wacdo.entities.Collaborator;

import java.time.LocalDate;
import java.util.List;

public interface CollaboratorService {

    List<CollaboratorDTO> listerFiltrer(String nom, String prenom, String email);

    List<CollaboratorDTO> getCollaboratorsNonAffectes();



    CollaboratorCreateDTO create(CollaboratorCreateDTO dto);

    //CollaboratorCreateDTO update(Long id, CollaboratorCreateDTO dto);

    CollaboratorDTO update(Long id, CollaboratorDTO collaboratorDTO);

    public void delete(Long id);





}
