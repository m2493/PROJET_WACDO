package com.marion.wacdo.repository;

import com.marion.wacdo.entities.Collaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollaboratorRepository extends JpaRepository <Collaborator, Long>
        {

            @Query(value = """
    SELECT * FROM collaborator
    WHERE (:last_name IS NULL OR LOWER(last_name) LIKE LOWER(CONCAT('%', :last_name, '%')))
      AND (:first_name IS NULL OR LOWER(first_name) LIKE LOWER(CONCAT('%', :first_name, '%')))
      AND (:email IS NULL OR LOWER(email) LIKE LOWER(CONCAT('%', :email, '%')))
""", nativeQuery = true)
    List<Collaborator> listerFiltrer(
            @Param("last_name") String last_name,
            @Param("first_name") String first_name,
            @Param("email") String email
    );


    @Query(value = """
        SELECT c FROM Collaborator c
           WHERE NOT EXISTS (
               SELECT 1
               FROM Affectation a
               WHERE a.collaborator = c
               AND a.endDateAffectation IS NULL
           )
    """)
    List<Collaborator> findCollaboratorsNonAffectes();

    Optional<Collaborator> findByEmail(String email);

}
