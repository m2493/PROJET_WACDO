package com.marion.wacdo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter

public class AffectationCreateDTO {

    @NotNull
    private Long collaboratorId;

    @NotNull
    private Long jobId;

    @NotNull
    private Long restaurantId;

    @NotNull
    private LocalDate startDateAffectation;

    private LocalDate endDateAffectation;
}
