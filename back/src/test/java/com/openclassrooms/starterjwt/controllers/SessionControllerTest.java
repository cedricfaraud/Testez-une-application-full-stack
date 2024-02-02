package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;

@SpringBootTest
public class SessionControllerTest {
    private static final String TEACHER_LAST_NAME = "teacherLastName";
    private static final String TEACHER_FIRST_NAME = "teacherFirstName";
    private static final String SESSION_DESCRIPTION = "session description";
    private static final String SESSION = "session";
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";

    @Mock
    private SessionMapper sessionMapper;

    @Mock
    private SessionService sessionService;

    private SessionController sessionController;

    List<Session> sessions;

    Session session;
    SessionDto sessionDto;

    Teacher teacher;

    List<User> users;
    User user;

    @BeforeEach
    void setUp() {
        sessionController = new SessionController(sessionService, sessionMapper);
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName(TEACHER_FIRST_NAME)
                .lastName(TEACHER_LAST_NAME)
                .build();
        user = User.builder()
                .id(1L)
                .firstName(FIRSTNAME)
                .lastName(LASTNAME)
                .email(EMAIL)
                .password(PASSWORD)
                .admin(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        users = new ArrayList<User>();
        users.add(user);
        session = Session.builder()
                .id(1L)
                .name(SESSION)
                .teacher(teacher)
                .date(Date.from(LocalDateTime.now().toInstant(ZoneOffset.UTC)))
                .description(SESSION_DESCRIPTION)
                .createdAt(null)
                .updatedAt(null)
                .users(users)
                .build();
        sessionDto = new SessionDto(1L, SESSION, Date.from(LocalDateTime.now().toInstant(ZoneOffset.UTC)), 1L,
                SESSION_DESCRIPTION, users.stream().map(User::getId).collect(Collectors.toList()), null, null);
    }

    @Test
    void testCreate() {
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.create(sessionDto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        SessionDto sessionResponse = (SessionDto) response.getBody();
        assertThat(sessionResponse.getId()).isEqualTo(1L);
        assertThat(sessionResponse.getName()).isEqualTo(SESSION);
        assertThat(sessionResponse.getDescription()).isEqualTo(SESSION_DESCRIPTION);
        assertThat(sessionResponse.getUsers().get(0)).isEqualTo(1L);
        assertThat(sessionResponse.getTeacher_id()).isEqualTo(1L);
        assertThat(sessionResponse.getDate()).isNotNull();
    }

    @Test
    void testFindAll() {
        when(sessionService.findAll()).thenReturn(sessions);
        List<SessionDto> sessionDtoList = new ArrayList<SessionDto>();
        sessionDtoList.add(sessionDto);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtoList);

        ResponseEntity<?> response = sessionController.findAll();

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        List<SessionDto> sessionResponse = (List<SessionDto>) response.getBody();
        assertThat(sessionResponse.get(0).getId()).isEqualTo(1L);
        assertThat(sessionResponse.get(0).getName()).isEqualTo(SESSION);
        assertThat(sessionResponse.get(0).getDescription()).isEqualTo(SESSION_DESCRIPTION);
        assertThat(sessionResponse.get(0).getUsers().get(0)).isEqualTo(1L);
        assertThat(sessionResponse.get(0).getTeacher_id()).isEqualTo(1L);
        assertThat(sessionResponse.get(0).getDate()).isNotNull();
    }

    @Test
    void testFindById() {
        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        SessionDto sessionResponse = (SessionDto) response.getBody();
        assertThat(sessionResponse.getId()).isEqualTo(1L);
        assertThat(sessionResponse.getName()).isEqualTo(SESSION);
        assertThat(sessionResponse.getDescription()).isEqualTo(SESSION_DESCRIPTION);
        assertThat(sessionResponse.getUsers().get(0)).isEqualTo(1L);
        assertThat(sessionResponse.getTeacher_id()).isEqualTo(1L);
        assertThat(sessionResponse.getDate()).isNotNull();
    }

    @Test
    void testNoLongerParticipate() {
        ResponseEntity<?> response = sessionController.noLongerParticipate(session.getId().toString(),
                user.getId().toString());

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
    }

    @Test
    void testNoLongerParticipate_WrongFormatID() {

        ResponseEntity<?> response = sessionController.noLongerParticipate(EMAIL,
                user.getId().toString());

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

    @Test
    void testParticipate() {
        ResponseEntity<?> response = sessionController.participate(session.getId().toString(), user.getId().toString());

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
    }

    @Test
    void testParticipate_WrongFormatID() {
        ResponseEntity<?> response = sessionController.participate(EMAIL, user.getId().toString());

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

    @Test
    void testSave() {
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);
        when(sessionService.getById(session.getId())).thenReturn(session);

        ResponseEntity<?> response = sessionController.save(session.getId().toString());

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
    }

    @Test
    void testSave_WrongFormatID() {

        ResponseEntity<?> response = sessionController.save(EMAIL);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

    @Test
    void testSave_NotFound() {

        when(sessionService.getById(session.getId())).thenReturn(null);

        ResponseEntity<?> response = sessionController.save(session.getId().toString());

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    @Test
    void testUpdate() {
        when(sessionService.update(session.getId(), session)).thenReturn(session);
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.update(session.getId().toString(), sessionDto);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        SessionDto sessionResponse = (SessionDto) response.getBody();
        assertThat(sessionResponse.getId()).isEqualTo(1L);
        assertThat(sessionResponse.getName()).isEqualTo(SESSION);
        assertThat(sessionResponse.getDescription()).isEqualTo(SESSION_DESCRIPTION);
        assertThat(sessionResponse.getUsers().get(0)).isEqualTo(1L);
        assertThat(sessionResponse.getTeacher_id()).isEqualTo(1L);
        assertThat(sessionResponse.getDate()).isNotNull();
    }

    @Test
    void testUpdate_WrongFormatSessionID() {
        ResponseEntity<?> response = sessionController.update(EMAIL, sessionDto);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }
}
