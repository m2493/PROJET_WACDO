package com.marion.wacdo.service;


import com.marion.wacdo.dto.CollaboratorEnPosteDTO;
import com.marion.wacdo.dto.RestaurantDTO;
import com.marion.wacdo.entities.Restaurant;
import com.marion.wacdo.repository.AffectationRepository;
import com.marion.wacdo.repository.RestaurantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final AffectationRepository affectationRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public RestaurantServiceImpl(RestaurantRepository restaurantRepository,
                             AffectationRepository affectationRepository,
                             ModelMapper modelMapper) {
        this.restaurantRepository = restaurantRepository;
        this.affectationRepository = affectationRepository;
        this.modelMapper = modelMapper;
    }

    // Liste de tous les restaurants
    public List<RestaurantDTO> getAll() {
        return restaurantRepository.findAll().stream()
                .map(r -> modelMapper.map(r, RestaurantDTO.class))
                .toList();
    }

    // Détail d’un restaurant avec collaborateurs en poste
    public RestaurantDTO getDetail(Long restaurantId,
                                   String jobTitle,
                                   String firstName,
                                   LocalDate startDate) {
        Restaurant r = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant introuvable"));

        RestaurantDTO dto = modelMapper.map(r, RestaurantDTO.class);

        List<CollaboratorEnPosteDTO> collaborators = affectationRepository
                .findCurrentByRestaurantWithFilters(restaurantId, jobTitle, firstName, startDate)
                .stream()
                .map(a -> {
                    CollaboratorEnPosteDTO c = new CollaboratorEnPosteDTO();
                    c.setId(a.getCollaborator().getId());
                    c.setFirstName(a.getCollaborator().getFirstName());
                    c.setLastName(a.getCollaborator().getLastName());
                    c.setEmail(a.getCollaborator().getEmail());
                    c.setJobTitle(a.getJob().getLabelFunction());
                    c.setStartDateAffectation(
                            Optional.ofNullable(a.getStartDateAffectation())
                                    .map(LocalDate::toString)
                                    .orElse(null)
                    );
                    return c;
                }).toList();

        dto.setCurrentCollaborators(collaborators);
        return dto;
    }

    // Recherche de restaurants
    public List<RestaurantDTO> search(String name, String city, String postalCode) {
        return restaurantRepository.search(name, city, postalCode).stream()
                .map(r -> modelMapper.map(r, RestaurantDTO.class))
                .toList();
    }

    // Création d’un restaurant
    public RestaurantDTO create(Restaurant restaurant) {
        Restaurant saved = restaurantRepository.save(restaurant);
        return modelMapper.map(saved, RestaurantDTO.class);
    }

    public RestaurantDTO update(Long id, RestaurantDTO restaurantDTO) {
        Restaurant existingRestaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant introuvable avec l'id : " + id));

        modelMapper.map(restaurantDTO, existingRestaurant);

        Restaurant updatedRestaurant = restaurantRepository.save(existingRestaurant);

        return modelMapper.map(updatedRestaurant, RestaurantDTO.class);
    }

    public void delete(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant introuvable avec l'id : " + id));

        restaurantRepository.delete(restaurant);
    }

}
