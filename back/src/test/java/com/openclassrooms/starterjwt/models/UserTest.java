package com.openclassrooms.starterjwt.models;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserTest {
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";

    @Test
    void testBuilder() {

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

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getFirstName()).isEqualTo(FIRSTNAME);
        assertThat(user.getLastName()).isEqualTo(LASTNAME);
        assertThat(user.getEmail()).isEqualTo(EMAIL);
        assertThat(user.getPassword()).isEqualTo(PASSWORD);
    }
}
