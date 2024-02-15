package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;

@SpringBootTest
public class TeacherMapperTest {
    private static final Long ID = 1L;
    private static final Long ID_2 = 2L;
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";

    @Autowired
    private TeacherMapper teacherMapper;

    @Test
    void testToEntity() {
        TeacherDto teacherDto = getTeacherDto(ID);

        Teacher teacher = teacherMapper.toEntity(teacherDto);

        assertNotNull(teacher);
        assertEquals(teacherDto.getId(), teacher.getId());
    }

    @Test
    void testToEntityList() {
        List<TeacherDto> teacherDtoList = new ArrayList<TeacherDto>();
        teacherDtoList.add(getTeacherDto(ID));
        teacherDtoList.add(getTeacherDto(ID_2));

        List<Teacher> teacherList = teacherMapper.toEntity(teacherDtoList);

        assertNotNull(teacherList);
        assertEquals(teacherDtoList.size(), teacherList.size());
        assertEquals(teacherDtoList.get(1).getId(), teacherList.get(1).getId());
    }

    @Test
    void testToDto() {
        Teacher teacher = getTeacher(ID);

        TeacherDto teacherDto = teacherMapper.toDto(teacher);

        assertNotNull(teacherDto);
        assertEquals(teacherDto.getId(), teacher.getId());
    }

    @Test
    void testToDtoList() {
        List<Teacher> teacherList = new ArrayList<Teacher>();
        teacherList.add(getTeacher(ID));
        teacherList.add(getTeacher(ID_2));

        List<TeacherDto> teacherDtoList = teacherMapper.toDto(teacherList);

        assertNotNull(teacherDtoList);
        assertEquals(teacherDtoList.get(1).getId(), teacherList.get(1).getId());
    }

    private Teacher getTeacher(Long id) {
        Teacher teacher = new Teacher();
        teacher.setId(id);
        teacher.setFirstName(FIRSTNAME);
        teacher.setLastName(LASTNAME);
        return teacher;
    }

    private TeacherDto getTeacherDto(Long id) {
        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(id);
        teacherDto.setFirstName(FIRSTNAME);
        teacherDto.setLastName(LASTNAME);
        return teacherDto;
    }
}
