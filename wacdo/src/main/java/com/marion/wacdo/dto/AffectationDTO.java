package com.marion.wacdo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data

public class AffectationDTO {

    private Long id;
    private LocalDate startDateAffectation;
    private LocalDate endDateAffectation;

    private Long collaboratorId;
    private String collaboratorFirstName;
    private String collaboratorLastName;
    private String collaboratorEmail;

    private Long jobId;
    private String jobTitle;

    private Long restaurantId;
    private String restaurantName;
    private String restaurantCity;
    private String restaurantPostalCode;

}

