package com.marion.wacdo.service;

import com.marion.wacdo.dto.RestaurantDTO;
import com.marion.wacdo.entities.Restaurant;
import com.marion.wacdo.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RestaurantServiceImplIntegrationTest {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    private Restaurant restaurant1;
    private Restaurant restaurant2;

    @BeforeEach
    void setUp() {

        restaurantRepository.deleteAll();

        restaurant1 = createRestaurant(
                "McDo Niort",
                "Niort",
                "79000"
        );

        restaurant2 = createRestaurant(
                "McDo Paris",
                "Paris",
                "75000"
        );
    }

    private Restaurant createRestaurant(
            String name,
            String city,
            String postalCode
    ) {

        Restaurant restaurant = new Restaurant();

        restaurant.setName(name);
        restaurant.setCity(city);
        restaurant.setPostalCode(postalCode);

        Restaurant saved = restaurantRepository.save(restaurant);

        assertNotNull(saved.getId());

        return saved;
    }

    @Test
    void shouldReturnAllRestaurants() {


        List<RestaurantDTO> result = restaurantService.getAll();


        assertEquals(2, result.size());
    }

    @Test
    void shouldCreateRestaurant() {


        Restaurant restaurant = new Restaurant();

        restaurant.setName("McDo Bordeaux");
        restaurant.setCity("Bordeaux");
        restaurant.setPostalCode("33000");


        RestaurantDTO result = restaurantService.create(restaurant);


        assertNotNull(result);
        assertEquals("McDo Bordeaux", result.getName());

        List<Restaurant> restaurants = restaurantRepository.findAll();

        assertEquals(3, restaurants.size());
    }

    /*@Test
    void shouldUpdateRestaurant() {


        RestaurantDTO dto = new RestaurantDTO();

        dto.setName("McDo Updated");
        dto.setCity(restaurant1.getCity());
        dto.setPostalCode(restaurant1.getPostalCode());


        RestaurantDTO updated =
                restaurantService.update(restaurant1.getId(), dto);


        assertEquals("McDo Updated", updated.getName());

        Restaurant entity =
                restaurantRepository.findById(restaurant1.getId())
                        .orElseThrow();

        assertEquals("McDo Updated", entity.getName());
    }
*/
    @Test
    void shouldDeleteRestaurant() {


        restaurantService.delete(restaurant1.getId());


        assertFalse(
                restaurantRepository.existsById(restaurant1.getId())
        );
    }

    @Test
    void shouldThrowExceptionWhenDeletingUnknownRestaurant() {

        assertThrows(RuntimeException.class, () -> {
            restaurantService.delete(999L);
        });
    }

    @Test
    void shouldSearchRestaurantByCity() {

        // WHEN
        List<RestaurantDTO> result =
                restaurantService.search(null, "Niort", null);

        // THEN
        assertEquals(1, result.size());
        assertEquals("Niort", result.get(0).getCity());
    }

    @Test
    void shouldSearchRestaurantByPostalCode() {

        // WHEN
        List<RestaurantDTO> result =
                restaurantService.search(null, null, "75000");

        // THEN
        assertEquals(1, result.size());
        assertEquals("75000", result.get(0).getPostalCode());
    }

    @Test
    void shouldThrowExceptionWhenRestaurantNotFound() {

        assertThrows(RuntimeException.class, () -> {
            restaurantService.getDetail(
                    999L,
                    null,
                    null,
                    null
            );
        });
    }
}