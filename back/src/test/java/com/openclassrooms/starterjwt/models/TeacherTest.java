package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.Assertions.within;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TeacherTest {
    private static final String TEACHER_LAST_NAME = "teacherLastName";
    private static final String TEACHER_FIRST_NAME = "teacherFirstName";

    @Test
    void testBuilder() {
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName(TEACHER_FIRST_NAME)
                .lastName(TEACHER_LAST_NAME)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getLastName()).isEqualTo(TEACHER_LAST_NAME);
        assertThat(teacher.getFirstName()).isEqualTo(TEACHER_FIRST_NAME);
        assertThat(teacher.getCreatedAt()).isCloseTo(LocalDateTime.now(), within(1, ChronoUnit.SECONDS));
        assertThat(teacher.getUpdatedAt()).isCloseTo(LocalDateTime.now(), within(1, ChronoUnit.SECONDS));
    }
}
