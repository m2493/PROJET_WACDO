package com.marion.wacdo.configs;

import com.marion.wacdo.dto.CollaboratorDTO;
import com.marion.wacdo.dto.JobDTO;
import com.marion.wacdo.entities.Affectation;
import com.marion.wacdo.dto.AffectationDTO;
import com.marion.wacdo.entities.Collaborator;
import com.marion.wacdo.entities.Job;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigModelMapper {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Mapping de Affectation vers AffectationDTO
        TypeMap<Affectation, AffectationDTO> typeMap = modelMapper.createTypeMap(Affectation.class, AffectationDTO.class);

        typeMap.addMappings(mapper -> {
            // Collaborator
            mapper.map(src -> src.getCollaborator().getId(), AffectationDTO::setCollaboratorId);
            mapper.map(src -> src.getCollaborator().getFirstName(), AffectationDTO::setCollaboratorFirstName);
            mapper.map(src -> src.getCollaborator().getLastName(), AffectationDTO::setCollaboratorLastName);
            mapper.map(src -> src.getCollaborator().getEmail(), AffectationDTO::setCollaboratorEmail);

            // Job
            mapper.map(src -> src.getJob().getId(), AffectationDTO::setJobId);
            mapper.map(src -> src.getJob().getLabelFunction(), AffectationDTO::setJobTitle);

            // Restaurant
            mapper.map(src -> src.getRestaurant().getId(), AffectationDTO::setRestaurantId);
            mapper.map(src -> src.getRestaurant().getName(), AffectationDTO::setRestaurantName);
            mapper.map(src -> src.getRestaurant().getCity(), AffectationDTO::setRestaurantCity);
            mapper.map(src -> src.getRestaurant().getPostalCode(), AffectationDTO::setRestaurantPostalCode);
        });

        // ---------------------------
        // COLLABORATOR DTO -> ENTITY (UPDATE SAFE)
        // ---------------------------
        modelMapper.typeMap(CollaboratorDTO.class, Collaborator.class)
                .addMappings(mapper -> {
                    mapper.skip(Collaborator::setId); // 
                });



            modelMapper.typeMap(JobDTO.class, Job.class)
                    .addMappings(mapper -> mapper.skip(Job::setId));



        return modelMapper;


    }
}