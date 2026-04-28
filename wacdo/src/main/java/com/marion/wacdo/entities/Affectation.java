package com.marion.wacdo.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Affectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @PastOrPresent
    private LocalDate startDateAffectation;
    private LocalDate endDateAffectation;

    @ManyToOne
    @JoinColumn(name="restaurant_id",nullable = false)
    private Restaurant restaurant;
    @ManyToOne
    @JoinColumn(name="collaborator_id",nullable = false)
    private Collaborator collaborator;
    @ManyToOne
    @JoinColumn(name="job_id",nullable = false)
    private Job job;

}
