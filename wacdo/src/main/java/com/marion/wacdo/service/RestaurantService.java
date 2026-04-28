package com.marion.wacdo.service;

import com.marion.wacdo.dto.RestaurantDTO;
import com.marion.wacdo.entities.Restaurant;

import java.time.LocalDate;
import java.util.List;

public interface RestaurantService {

    List<RestaurantDTO> getAll();

    RestaurantDTO getDetail(Long restaurantId,
                            String jobTitle,
                            String firstName,
                            LocalDate startDate);

    List<RestaurantDTO> search(String name, String city, String postalCode);

    RestaurantDTO create(Restaurant restaurant);

    RestaurantDTO update(Long id, RestaurantDTO restaurantDTO);

    public void delete(Long id);
}
