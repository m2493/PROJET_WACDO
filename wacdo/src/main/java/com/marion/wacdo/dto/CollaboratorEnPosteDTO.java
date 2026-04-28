package com.marion.wacdo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(callSuper = true)

//Ce DTO ne contient que l’essentiel pour la vue collaborateur dans le restaurant.
//
//Utile pour les listes filtrables par poste, nom, date de début.

public class CollaboratorEnPosteDTO extends CollaboratorBaseDTO {

    private Long id;
    private String jobTitle;      // Poste actuel
    private String startDateAffectation; // Date de début au format ISO


}
