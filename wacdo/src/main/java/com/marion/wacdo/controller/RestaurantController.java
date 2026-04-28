package com.marion.wacdo.controller;


import com.marion.wacdo.dto.RestaurantDTO;
import com.marion.wacdo.entities.Restaurant;
import com.marion.wacdo.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    // Liste tous les restaurants
    @GetMapping
    public List<RestaurantDTO> getAll() {
        return restaurantService.getAll();
    }

    // Détail d’un restaurant avec filtres sur collaborateurs
    @GetMapping("/{id}")
    public RestaurantDTO getDetail(
            @PathVariable Long id,
            @RequestParam(required = false) String jobTitle,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate
    ) {
        return restaurantService.getDetail(id, jobTitle, firstName, startDate);
    }

    // Recherche de restaurants
    @GetMapping("/search")
    public List<RestaurantDTO> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String postalCode
    ) {
        return restaurantService.search(name, city, postalCode);
    }

    // Création d’un restaurant
    @PostMapping
    public RestaurantDTO create(@RequestBody Restaurant restaurant) {
        return restaurantService.create(restaurant);
    }

    // Mise à jour d’un restaurant
    @PutMapping("/{id}")
    public RestaurantDTO update(
            @PathVariable Long id,
            @RequestBody RestaurantDTO restaurantDTO) {

        return restaurantService.update(id, restaurantDTO);
    }

    // Suppression d’un restaurant
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        restaurantService.delete(id);
    }
}
