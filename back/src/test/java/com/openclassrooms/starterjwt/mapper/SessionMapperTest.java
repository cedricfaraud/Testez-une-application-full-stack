package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;

@SpringBootTest
public class SessionMapperTest {
    private static final long SESSION_ID = 1L;
    private static final long SESSION_ID_2 = 1L;
    private static final long DEFAULT_ID = 1L;
    private static final String DESCRIPTION = "description";
    private static final String NAME = "name";

    @Autowired
    private SessionMapperImpl sessionMapper;
    @InjectMocks
    SessionMapperImpl sessionMapperImpl;

    private SessionDto sessionDto;
    private Session session;
    private LocalDateTime date;

    @BeforeEach
    public void setUp() {
        date = LocalDateTime.now();
        sessionDto = getSessionDto(SESSION_ID);
        session = getSession(SESSION_ID);
    }

    @Test
    void testToEntity() {

        Session session = sessionMapper.toEntity(sessionDto);

        assertNotNull(session);
        assertEquals(sessionDto.getId(), session.getId());
    }

    @Test
    void testToEntityList() {

        List<SessionDto> sessionDtoList = getSessionDtoList();
        List<Session> sessionList = sessionMapper.toEntity(sessionDtoList);

        assertNotNull(sessionList);
        assertEquals(sessionDtoList.get(1).getId(), sessionList.get(1).getId());
    }

    @Test
    void testToDto() {

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertNotNull(sessionDto);
        assertEquals(session.getId(), sessionDto.getId());
    }

    @Test
    void testToDtoList() {
        List<Session> sessionList = getSessionList();
        List<SessionDto> sessionDtoList = sessionMapper.toDto(sessionList);

        assertNotNull(sessionDtoList);
        assertEquals(sessionDtoList.get(1).getId(), sessionDtoList.get(1).getId());
    }

    /**
     * detail method to cover sessionDto manual sets
     * 
     * @param id
     * @return
     */
    private SessionDto getSessionDto(Long id) {
        Teacher teacher = new Teacher();
        teacher.setId(DEFAULT_ID);
        User user = new User();
        user.setId(DEFAULT_ID);
        SessionDto dto = new SessionDto();
        dto.setId(id);
        dto.setName(NAME);
        dto.setDescription(DESCRIPTION);
        dto.setDate(new Date());
        dto.setTeacher_id(teacher.getId());
        dto.setUsers(Arrays.asList(user.getId()));
        dto.setCreatedAt(date);
        dto.setUpdatedAt(date);
        return dto;
    }

    private List<SessionDto> getSessionDtoList() {
        List<SessionDto> sessionDtoList = new ArrayList<SessionDto>();
        sessionDtoList.add(getSessionDto(SESSION_ID));
        sessionDtoList.add(getSessionDto(SESSION_ID_2));
        return sessionDtoList;
    }

    private List<Session> getSessionList() {
        List<Session> sessionList = new ArrayList<Session>();
        sessionList.add(getSession(SESSION_ID));
        sessionList.add(getSession(SESSION_ID_2));
        return sessionList;
    }

    private Session getSession(Long id) {
        Teacher teacher = new Teacher();
        teacher.setId(DEFAULT_ID);
        User user = new User();
        user.setId(DEFAULT_ID);
        return Session.builder().id(id).name(NAME).description(DESCRIPTION).teacher(teacher).users(Arrays.asList(user))
                .date(new Date()).createdAt(date)
                .updatedAt(date)
                .teacher(new Teacher()).users(new ArrayList<User>()).build();
    }
}
