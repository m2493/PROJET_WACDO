package com.marion.wacdo.dto;

import com.marion.wacdo.entities.Collaborator;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;


@Data
@MappedSuperclass
public class CollaboratorDTO extends CollaboratorBaseDTO {

    private Long id;


}
