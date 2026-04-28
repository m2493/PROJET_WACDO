package com.marion.wacdo.repository;

import com.marion.wacdo.entities.Affectation;
import com.marion.wacdo.entities.Collaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AffectationRepository extends JpaRepository<Affectation, Long> {

    // Vérifie si un collaborateur a déjà une affectation en cours
    boolean existsByCollaboratorIdAndEndDateAffectationIsNull(Long collaboratorId);


    // Affectations d’un collaborateur
    @Query("SELECT a FROM Affectation a WHERE a.collaborator.id = :collaboratorId")
    List<Affectation> findByCollaborator(@Param("collaboratorId") Long collaboratorId);



    //Permet de filtrer la liste des collaborateurs en poste directement.
    // Pour lister les collaborateurs en poste ou filtrer par poste/date :
    @Query("""
    SELECT a FROM Affectation a
    JOIN a.collaborator c
    JOIN a.job j
    WHERE a.restaurant.id = :restaurantId
      AND a.endDateAffectation IS NULL
      AND (:jobTitle IS NULL OR LOWER(j.labelFunction) LIKE LOWER(CONCAT('%', :jobTitle, '%')))
      AND (:firstName IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')))
      AND (:startDate IS NULL OR a.startDateAffectation >= :startDate)
""")
    List<Affectation> findCurrentByRestaurantWithFilters(
            @Param("restaurantId") Long restaurantId,
            @Param("jobTitle") String jobTitle,
            @Param("firstName") String firstName,
            @Param("startDate") LocalDate startDate
    );


    // Collaborateurs en poste dans un restaurant
    @Query("SELECT a FROM Affectation a WHERE a.restaurant.id = :restaurantId AND a.endDateAffectation IS NULL")
    List<Affectation> findCurrentByRestaurant(@Param("restaurantId") Long restaurantId);


    // Recherche avec filtres : poste, dates, ville
    @Query("""
        SELECT a FROM Affectation a
        JOIN a.job j
        JOIN a.restaurant r
        WHERE (:jobTitle IS NULL OR LOWER(j.labelFunction) LIKE LOWER(CONCAT('%', :jobTitle, '%')))
          AND (:startDate IS NULL OR a.startDateAffectation >= :startDate)
          AND (:endDate IS NULL OR a.endDateAffectation <= :endDate)
          AND (:city IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', :city, '%')))
    """)
    List<Affectation> search(
            @Param("jobTitle") String jobTitle,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("city") String city
    );
}
