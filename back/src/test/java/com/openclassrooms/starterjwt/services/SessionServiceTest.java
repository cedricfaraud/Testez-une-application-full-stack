package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";

    @InjectMocks
    SessionService sessionService;
    @Mock
    SessionRepository sessionRepository;
    @Mock
    UserRepository userRepository;

    @Test
    void testParticipate() {

        User user = getUser();
        Session session = getSession(3L);
        when(sessionRepository.findById(3L)).thenReturn(Optional.ofNullable(session));
        when(userRepository.findById(1L)).thenReturn(Optional.ofNullable(user));

        sessionService.participate(3L, 1L);

        assertThat(session.getUsers().get(0)).isEqualTo(user);
    }

    @Test
    void testParticipate_SessionNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testParticipate_UserNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(new Session()));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testParticipate_AlreadyParticipate() {
        User user = getUser();
        Session session = getSession(1L);
        List<User> userList = new ArrayList<User>();
        userList.add(user);
        session.setUsers(userList);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testCreate() {
        Session session = getSession(3L);
        when(sessionRepository.save(session)).thenReturn(session);

        Session sessionSaved = sessionService.create(session);

        assertThat(sessionSaved).isEqualTo(session);
    }

    @Test
    void testDelete() {
        sessionService.delete(3L);

        assertThat(sessionRepository.existsById(3L)).isFalse();
    }

    @Test
    void testFindAll() {

        List<Session> sessionList = getSessionList();
        when(sessionRepository.findAll()).thenReturn(sessionList);

        List<Session> sessionsFound = sessionService.findAll();
        assertThat(sessionsFound).isEqualTo(sessionList);
    }

    @Test
    void testGetById() {
        Session session = getSession(1L);
        when(sessionRepository.findById(1L)).thenReturn(Optional.ofNullable(session));

        Session sessionFound = sessionService.getById(1L);

        assertThat(sessionFound).isEqualTo(session);
    }

    @Test
    void testNoLongerParticipate() {
        Session session = getSession(3L);
        when(sessionRepository.findById(3L)).thenReturn(Optional.ofNullable(session));
        User user = getUser();
        when(userRepository.findById(1L)).thenReturn(Optional.ofNullable(user));
        sessionService.participate(3L, 1L);

        sessionService.noLongerParticipate(3L, 1L);

        assertThat(session.getUsers().size()).isEqualTo(0);
    }

    @Test
    void testNoLongerParticipate_SessionNotFound() {

        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
    }

    @Test
    void testNoLongerParticipate_NotAlreadyParticipate() {

        User user = getUser();
        Session session = getSession(1L);

        List<User> userList = new ArrayList<User>();
        userList.add(user);
        session.setUsers(userList);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 2L));
    }

    @Test
    void testUpdate() {
        Session session = getSession(3L);
        when(sessionRepository.save(session)).thenReturn(session);

        Session sessionSaved = sessionService.update(3L, session);

        assertThat(sessionSaved).isEqualTo(session);
    }

    private List<Session> getSessionList() {
        List<Session> sessions = new ArrayList<>();
        sessions.add(getSession(1L));
        sessions.add(getSession(2L));
        sessions.add(getSession(3L));

        return sessions;
    }

    private Session getSession(Long id) {
        return Session.builder().id(id).createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
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
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
