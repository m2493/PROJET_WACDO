package com.marion.wacdo.dto;

import lombok.Data;

import java.util.List;

@Data
public class RestaurantDTO {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String postalCode;

    // Liste des collaborateurs actuellement en poste
    private List<CollaboratorEnPosteDTO> currentCollaborators;
}
