package com.marion.wacdo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marion.wacdo.configs.JwtRequestFilter;
import com.marion.wacdo.controller.CollaboratorController;
import com.marion.wacdo.dto.CollaboratorCreateDTO;
import com.marion.wacdo.dto.CollaboratorDTO;
import com.marion.wacdo.service.CollaboratorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CollaboratorController.class)
@Import(TestSecurityConfig.class) // ta config de sécurité pour @WebMvcTest
public class CollaboratorControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; // sérialisation JSON

    @MockBean
    private CollaboratorService collaboratorService;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private JwtRequestFilter jwtRequestFilter;

    // ------------------ GET /api/collaborators ------------------
    @Test
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void adminCanGetAllCollaborators() throws Exception {
        CollaboratorDTO dto = new CollaboratorDTO();
        dto.setEmail("user@test.com");

        when(collaboratorService.listerFiltrer(null, null, null))
                .thenReturn(List.of(dto));



        mockMvc.perform(get("/api/collaborators")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
                 }

    @Test
    @WithMockUser(username = "user@test.com", roles = {"USER"})
    void userCannotGetAllCollaborators() throws Exception {
        mockMvc.perform(get("/api/collaborators"))
                .andExpect(status().isForbidden());
    }

    // ------------------ GET /api/collaborators/non-affectes ------------------
    @Test
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void adminCanGetNonAssignedCollaborators() throws Exception {
        CollaboratorDTO dto = new CollaboratorDTO();
        dto.setEmail("user@test.com");

        when(collaboratorService.getCollaboratorsNonAffectes())
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/collaborators/non-affectes")
                        .accept(MediaType.APPLICATION_JSON)) // <-- accepte JSON
                .andExpect(status().isOk());
                }

    @Test
    @WithMockUser(username = "user@test.com", roles = {"USER"})
    void userCannotGetNonAssignedCollaborators() throws Exception {
        mockMvc.perform(get("/api/collaborators/non-affectes"))
                .andExpect(status().isForbidden());
    }

    // ------------------ POST /api/collaborators ------------------
    @Test
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void adminCanCreateCollaborator() throws Exception {
        CollaboratorCreateDTO dto = new CollaboratorCreateDTO();
        dto.setEmail("new@collab.com");

        when(collaboratorService.create(any(CollaboratorCreateDTO.class)))
                .thenReturn(dto);

        String body = objectMapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

    }

    @Test
    @WithMockUser(username = "user@test.com", roles = {"USER"})
    void userCannotCreateCollaborator() throws Exception {
        CollaboratorCreateDTO dto = new CollaboratorCreateDTO();
        dto.setEmail("new@collab.com");
        String body = objectMapper.writeValueAsString(dto);

        mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    // ------------------ PUT /api/collaborators/{id} ------------------
    @Test
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void adminCanUpdateCollaborator() throws Exception {
        CollaboratorDTO dto = new CollaboratorDTO();
        dto.setId(1L);
        dto.setFirstName("Updated");

        when(collaboratorService.update(any(Long.class), any(CollaboratorDTO.class)))
                .thenReturn(dto);

        String body = objectMapper.writeValueAsString(dto);

        mockMvc.perform(put("/api/collaborators/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = {"USER"})
    void userCannotUpdateCollaborator() throws Exception {
        CollaboratorDTO dto = new CollaboratorDTO();
        dto.setFirstName("Updated");
        String body = objectMapper.writeValueAsString(dto);

        mockMvc.perform(put("/api/collaborators/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    // ------------------ DELETE /api/collaborators/{id} ------------------
    @Test
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void adminCanDeleteCollaborator() throws Exception {
        mockMvc.perform(delete("/api/collaborators/1"))
                .andExpect(status().isNoContent()); // DELETE → 204 No Content
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = {"USER"})
    void userCannotDeleteCollaborator() throws Exception {
        mockMvc.perform(delete("/api/collaborators/1"))
                .andExpect(status().isForbidden());
    }
}