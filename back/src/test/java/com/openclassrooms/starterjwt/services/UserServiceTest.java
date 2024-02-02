package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";
    @Mock
    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository);
    }

    @Test
    void testDelete() {
        Long id = 1L;

        userService.delete(id);

        assertThat(userService.findById(id)).isNull();
    }

    @Test
    void testFindById() {
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.of(getUser(id)));

        User result = userService.findById(id);

        assertThat(result.getId()).isEqualTo(id);
        assertThat(result.getFirstName()).isEqualTo(FIRSTNAME);
        assertThat(result.getLastName()).isEqualTo(LASTNAME);
        assertThat(result.getEmail()).isEqualTo(EMAIL);
        assertThat(result.getPassword()).isEqualTo(PASSWORD);
        assertThat(result.isAdmin()).isTrue();
    }

    private User getUser(Long id) {
        return User.builder()
                .id(id)
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
