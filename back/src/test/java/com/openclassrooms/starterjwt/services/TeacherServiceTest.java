package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {
    private static final Long ID = 1L;
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";

    @InjectMocks
    TeacherService teacherService;
    @Mock
    TeacherRepository teacherRepository;

    @Test
    void testFindAll() {

    }

    @Test
    void testFindById() {

        when(teacherRepository.findById(ID)).thenReturn(Optional.of(getTeacher()));

        assertThat(teacherService.findById(ID).getFirstName()).isEqualTo(FIRSTNAME);
        assertThat(teacherService.findById(ID).getLastName()).isEqualTo(LASTNAME);
    }

    private Teacher getTeacher() {
        return new Teacher(ID, LASTNAME, FIRSTNAME, LocalDateTime.now(), LocalDateTime.now());
    }
}
