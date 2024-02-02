package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SessionTest {
    private static final String TEACHER_LAST_NAME = "teacherLastName";
    private static final String TEACHER_FIRST_NAME = "teacherFirstName";
    private static final String DESCRIPTION = "description";
    private static final String NAME = "name";
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";
    Session session;

    @Test
    void testBuilder() {
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName(TEACHER_FIRST_NAME)
                .lastName(TEACHER_LAST_NAME)
                .build();
        User user = User.builder()
                .id(1L)
                .firstName(FIRSTNAME)
                .lastName(LASTNAME)
                .email(EMAIL)
                .password(PASSWORD)
                .admin(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        List<User> users = new ArrayList<>();
        users.add(user);
        // When
        session = Session.builder()
                .id(4L)
                .name(NAME)
                .description(DESCRIPTION)
                .date(Date.from(LocalDateTime.now().toInstant(java.time.ZoneOffset.UTC)))
                .teacher(teacher)
                .users(users)
                .build();
        // Then
        assertThat(session.getUsers()).isEqualTo(users);
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getId()).isEqualTo(4L);
        assertThat(session.getName()).isEqualTo(NAME);
        assertThat(session.getDescription()).isEqualTo(DESCRIPTION);
        assertThat(session.getDate()).isCloseTo(Date.from(LocalDateTime.now().toInstant(java.time.ZoneOffset.UTC)),
                1000);

    }
}
