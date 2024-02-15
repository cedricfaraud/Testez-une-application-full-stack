package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {
    private static final String TEACHER_LAST_NAME = "teacherLastName";
    private static final String TEACHER_FIRST_NAME = "teacherFirstName";
    @Mock
    TeacherMapper teacherMapper;
    @Mock
    TeacherService teacherService;
    TeacherController controller;

    Teacher teacher;

    List<Teacher> teachers;

    List<TeacherDto> teacherDtos;

    @BeforeEach
    void setUp() {
        controller = new TeacherController(teacherService, teacherMapper);
        teachers = new ArrayList<>();

        teacher = new Teacher();
        teacher.setFirstName(TEACHER_FIRST_NAME);
        teacher.setLastName(TEACHER_LAST_NAME);
        teacher.setId(1L);
        teacher.setCreatedAt(null);
        teacher.setUpdatedAt(null);

        teachers.add(teacher);
        teachers.add(new Teacher(2L, "Yoga", "Julie", null, null));
        teachers.add(new Teacher(3L, "Sport", "Sophie", null, null));
        teacherDtos = new ArrayList<>();
        teacherDtos.add(new TeacherDto(1L, "Faraud", "Cedric", null, null));
        teacherDtos.add(new TeacherDto(2L, "Yoga", "Julie", null, null));
        teacherDtos.add(new TeacherDto(3L, "Sport", "Sophie", null, null));
    }

    @Test
    void testFindAll() {

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        ResponseEntity response = controller.findAll();

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isInstanceOf(List.class);
        List<TeacherDto> body = (List<TeacherDto>) response.getBody();
        assertThat(body.size()).isEqualTo(3);
        assertThat(body.get(0).getFirstName()).isEqualTo("Cedric");
        assertThat(body.get(1).getFirstName()).isEqualTo("Julie");
        assertThat(body.get(2).getFirstName()).isEqualTo("Sophie");

    }

    @Test
    void testFindById() {

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDtos.get(0));

        ResponseEntity response = controller.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        TeacherDto responseBody = (TeacherDto) response.getBody();
        assertThat(responseBody.getId()).isEqualTo(1L);
        assertThat(responseBody.getFirstName()).isEqualTo("Cedric");
    }

    @Test
    void findById_WrongFormatID() {

        ResponseEntity response = controller.findById("Cedric");

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }

    @Test
    void findById_UnknowUserID() {

        when(teacherService.findById(0L)).thenReturn(null);

        ResponseEntity response = controller.findById("0");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }
}
