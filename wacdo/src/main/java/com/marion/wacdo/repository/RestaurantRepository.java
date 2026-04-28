package com.marion.wacdo.repository;


import com.marion.wacdo.entities.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    // Recherche flexible par nom, ville, code postal
    // On filtre sur name, city, postalCode.
    // Si un filtre est null, il est ignoré.

    @Query("""
        SELECT r FROM Restaurant r
        WHERE (:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%')))
          AND (:city IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:postalCode IS NULL OR r.postalCode LIKE CONCAT('%', :postalCode, '%'))
    """)
    List<Restaurant> search(
            @Param("name") String name,
            @Param("city") String city,
            @Param("postalCode") String postalCode
    );
}
