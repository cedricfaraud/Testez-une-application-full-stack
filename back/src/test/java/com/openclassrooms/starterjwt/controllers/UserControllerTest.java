package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest
public class UserControllerTest {
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";

    @Mock
    UserMapper userMapper;

    @Mock
    UserService userService;

    @Mock
    SecurityContextHolder securityContext;

    User user;
    UserDto userDto;

    private UserController controller;

    @BeforeEach
    void setUp() {
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
        userDto = new UserDto(1L, EMAIL, LASTNAME, FIRSTNAME, true, PASSWORD, LocalDateTime.now(), LocalDateTime.now());
        controller = new UserController(userService, userMapper);
    }

    @Test
    void testFindById() {

        when(this.userService.findById(1L)).thenReturn(user);
        when(this.userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity response = controller.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        UserDto responseBody = (UserDto) response.getBody();
        assertThat(responseBody.getId()).isEqualTo(1L);
        assertThat(responseBody.getFirstName()).isEqualTo(FIRSTNAME);
        assertThat(responseBody.getLastName()).isEqualTo(LASTNAME);
        assertThat(responseBody.getEmail()).isEqualTo(EMAIL);
        assertThat(responseBody.getPassword()).isEqualTo(PASSWORD);
        assertThat(responseBody.isAdmin()).isTrue();
        assertThat(responseBody.getCreatedAt()).isNotNull();
        assertThat(responseBody.getUpdatedAt()).isNotNull();
    }

    @Test
    void testFindById_UserNotFound() {

        when(this.userService.findById(1L)).thenReturn(null);

        ResponseEntity response = controller.findById("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    @Test
    @WithMockUser(username = EMAIL, password = PASSWORD, roles = "ADMIN")
    void testSave() {
        when(this.userService.findById(user.getId())).thenReturn(user);

        ResponseEntity<?> response = controller.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
    }

    @Test
    @WithMockUser(username = "bademail@studio.com", password = PASSWORD, roles = "ADMIN")
    void testSave_BadUser() {
        when(this.userService.findById(user.getId())).thenReturn(user);

        ResponseEntity<?> response = controller.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(401);
    }

    @Test
    @WithMockUser(username = EMAIL, password = PASSWORD, roles = "ADMIN")
    void testSave_UserNotFound() {
        when(this.userService.findById(user.getId())).thenReturn(null);

        ResponseEntity<?> response = controller.save("1");

        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }

    @Test
    @WithMockUser(username = EMAIL, password = PASSWORD, roles = "ADMIN")
    void testSave_WrongFormatID() {
        ResponseEntity<?> response = controller.save(EMAIL);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
    }
}
