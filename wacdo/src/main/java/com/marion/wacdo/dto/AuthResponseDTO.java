package com.marion.wacdo.dto;

import lombok.Getter;

@Getter
public class AuthResponseDTO {

    private String token;
    private boolean admin;
    private String email;

    public AuthResponseDTO(
            String token,
            boolean admin,
            String email
    ) {
        this.token = token;
        this.admin = admin;
        this.email = email;
    }
}