package com.marion.wacdo.repository;

import com.marion.wacdo.entities.Collaborator;
import com.marion.wacdo.entities.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

    //Pas de création de méthode car le JPARepository permet de récupérer automatiquement les méthodes
    // findAll, create et update (via save)

}
