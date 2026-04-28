package com.marion.wacdo.dto;

import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString(callSuper = true)

public class CollaboratorDetailDTO extends CollaboratorBaseDTO {
    private Long id;
    private List<AffectationDTO> affectations;


}
