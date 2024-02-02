package com.openclassrooms.starterjwt.controllers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Test
        void testAuthenticateUser() throws Exception {
                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ \"email\": \"yoga@studio.com\", \"password\": \"test!1234\" }")
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
        }

        @Test
        void testAuthenticateUser_BadCredentials() throws Exception {
                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{ \"email\": \"baduser@studio.com\", \"password\": \"test!1234\" }")
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                                .andExpect(status().isUnauthorized())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(content().json(
                                                "{\"path\":\"\",\"error\":\"Unauthorized\",\"message\":\"Bad credentials\",\"status\":401}"));
        }

        @Test
        void testRegisterUser() throws Exception {
                long now = System.currentTimeMillis();
                String login = Long.toString(now) + "@studio.com";
                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                                "{ \"email\": \"" + login
                                                                + "\", \"password\": \"test!1234\", \"firstName\": \"Cedric\", \"lastName\": \"Faraud\" }")
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
        }

        @Test
        void testRegisterUser_AlreadyTaken() throws Exception {
                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                                "{ \"email\": \"yoga@studio.com\", \"password\": \"test!1234\", \"firstName\": \"Cedric\", \"lastName\": \"Faraud\" }")
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                                .andExpect(status().isBadRequest())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(content().json("{\"message\":\"Error: Email is already taken!\"}"));
        }
}
