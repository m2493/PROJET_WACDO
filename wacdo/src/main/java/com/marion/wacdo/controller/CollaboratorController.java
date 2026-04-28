package com.marion.wacdo.controller;

import com.marion.wacdo.dto.CollaboratorCreateDTO;
import com.marion.wacdo.dto.CollaboratorDTO;
import com.marion.wacdo.service.CollaboratorService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaborators")
public class CollaboratorController {

    private final CollaboratorService service;

    public CollaboratorController(CollaboratorService service) {
        this.service = service;
    }


     @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CollaboratorDTO>> rechercher(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String email) {

        List<CollaboratorDTO> result = service.listerFiltrer(nom, prenom, email);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }

    // ------------------ GET /api/collaborators/non-affectes ------------------


    @GetMapping(value = "/non-affectes", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CollaboratorDTO>> nonAffectes() {
        List<CollaboratorDTO> result = service.getCollaboratorsNonAffectes();
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
    }

    // ------------------ POST /api/collaborators ------------------
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CollaboratorCreateDTO> create(@RequestBody CollaboratorCreateDTO dto) {
        CollaboratorCreateDTO created = service.create(dto);
        return ResponseEntity.ok(created);
    }

    // ------------------ PUT /api/collaborators/{id} ------------------
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CollaboratorDTO> update(
            @PathVariable Long id,
            @RequestBody CollaboratorDTO collaboratorDTO) {

        CollaboratorDTO updated = service.update(id, collaboratorDTO);
        return ResponseEntity.ok(updated);
    }

    // ------------------ DELETE /api/collaborators/{id} ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}