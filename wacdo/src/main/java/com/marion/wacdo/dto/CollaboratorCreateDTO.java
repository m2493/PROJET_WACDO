package com.marion.wacdo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(callSuper = true)

public class CollaboratorCreateDTO extends CollaboratorBaseDTO {

    @NotBlank
    private String password;
}
