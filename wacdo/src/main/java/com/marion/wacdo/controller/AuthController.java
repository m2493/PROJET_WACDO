package com.marion.wacdo.controller;

import com.marion.wacdo.dto.AuthRequestDTO;
import com.marion.wacdo.dto.AuthResponseDTO;
import com.marion.wacdo.entities.Collaborator;
import com.marion.wacdo.service.JwtUtilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtilService jwtUtilService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request){

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        Collaborator collaborator =
                (Collaborator) auth.getPrincipal();

        String token =
                jwtUtilService.generateToken(collaborator);

        return ResponseEntity.ok(
                new AuthResponseDTO(
                        token,
                        collaborator.isAdmin(),
                        collaborator.getEmail()
                )
        );
    }
}