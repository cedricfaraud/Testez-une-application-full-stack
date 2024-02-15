package com.openclassrooms.starterjwt.controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "yoga@studio.com", password = "test!1234")
public class SessionControllerIntegrationTest {
    private static final String TEACHER_LAST_NAME = "teacherLastName";
    private static final String TEACHER_FIRST_NAME = "teacherFirstName";
    private static final String DESCRIPTION = "description";
    private static final String NAME = "name";
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    SessionRepository sessionRepository;

    private Session mockSession;
    private Teacher mockTeacher;
    private LocalDateTime date;
    private User mockUser;

    @BeforeEach
    public void setUp() {
        date = LocalDateTime.now();
        mockTeacher = getTeacher();
        mockUser = getUser();
        mockSession = getSession(3L);
    }

    @Test
    void testGetSession() throws Exception {
        List<Session> sessionList = getSessionList();

        Mockito.when(sessionRepository.findAll()).thenReturn(sessionList);
        mockMvc.perform(get("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void testGetSession_DoesNotExist() throws Exception {

        Long id = 1L;

        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetSession_BadRequest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/{id}", "id")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testCreate() throws Exception {
        SessionDto sessionDto = getSessionDto();
        mockMvc.perform(post("/api/session")
                .content(new ObjectMapper().writeValueAsString(sessionDto))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testCreate_KO() throws Exception {
        SessionDto sessionDto = getSessionDto();
        sessionDto.setDescription(null);
        mockMvc.perform(post("/api/session")
                .content(new ObjectMapper().writeValueAsString(sessionDto))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testUpdate() throws Exception {
        SessionDto sessionDto = getSessionDto();
        sessionDto.setDescription("Session update test");

        mockMvc.perform(put("/api/session/1")
                .content(new ObjectMapper().writeValueAsString(sessionDto))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testUpdate_KO() throws Exception {
        SessionDto sessionDto = getSessionDto();
        sessionDto.setDescription(null);
        mockMvc.perform(put("/api/session/1")
                .content(new ObjectMapper().writeValueAsString(sessionDto))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    private SessionDto getSessionDto() {
        List<Long> users = new ArrayList<>();
        users.add(1L);
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("create test");
        sessionDto.setDate(Date.from(Instant.now()));
        sessionDto.setTeacher_id(2L);
        sessionDto.setDescription("Session create test");
        sessionDto.setUsers(users);
        return sessionDto;
    }

    private List<Session> getSessionList() {
        List<Session> sessions = new ArrayList<>();
        sessions.add(getSession(1L));
        sessions.add(getSession(2L));
        sessions.add(getSession(3L));

        return sessions;
    }

    private Session getSession(Long id) {
        return Session.builder().id(id).createdAt(date).updatedAt(date)
                .name(NAME)
                .description(DESCRIPTION)
                .teacher(new Teacher()).users(new ArrayList<User>()).build();
    }

    private User getUser() {
        return User.builder()
                .id(1L)
                .firstName(FIRSTNAME)
                .lastName(LASTNAME)
                .email(EMAIL)
                .password(PASSWORD)
                .admin(true)
                .createdAt(date)
                .updatedAt(date)
                .build();
    }

    private Teacher getTeacher() {
        return Teacher.builder()
                .id(1L)
                .firstName(TEACHER_FIRST_NAME)
                .lastName(TEACHER_LAST_NAME)
                .createdAt(date)
                .updatedAt(date)
                .build();
    }
}
