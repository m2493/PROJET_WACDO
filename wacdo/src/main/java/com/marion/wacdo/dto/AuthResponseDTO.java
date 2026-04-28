package com.marion.wacdo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter

public class AuthResponseDTO {

    private String token;

    public AuthResponseDTO(String token){
        this.token = token;
    }

}