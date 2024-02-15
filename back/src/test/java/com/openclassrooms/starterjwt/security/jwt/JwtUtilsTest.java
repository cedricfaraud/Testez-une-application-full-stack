package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import ch.qos.logback.classic.Level;
import io.jsonwebtoken.Jwts;

@SpringBootTest
@ExtendWith(LogSpy.class)
public class JwtUtilsTest {
    private static final String NAME = "Admin";

    @Autowired
    JwtUtils jwtUtils;

    private final LogSpy logSpy;

    private String token;

    public JwtUtilsTest(LogSpy logs) {
        this.logSpy = logs;
    }

    @BeforeEach
    public void setUp() {
        token = getToken();
    }

    @Test
    void testGenerateJwtToken() {
        assertNotNull(token);
    }

    @Test
    void testGetUserNameFromJwtToken() {
        String name = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals(name, NAME);
    }

    @Test
    void testValidateJwtToken() {
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    void testValidateJwtToken_MalformedJwtException() {
        assertFalse(jwtUtils.validateJwtToken("erreur"));
        logSpy.assertLogged(Level.ERROR,
                "Invalid JWT token");
    }

    @Test
    void testValidateJwtToken_SignatureException() {
        assertFalse(jwtUtils.validateJwtToken(token + "erreur"));
        logSpy.assertLogged(Level.ERROR,
                "Invalid JWT signature");
    }

    @Test
    void testValidateJwtToken_ExpiredJwtException() {
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 0);
        String expiredToken = getToken();
        assertFalse(jwtUtils.validateJwtToken(expiredToken));
        logSpy.assertLogged(Level.ERROR,
                "JWT token is expired");
    }

    @Test
    void testValidateJwtToken_IllegalArgumentException() {

        assertFalse(jwtUtils.validateJwtToken(""));
        logSpy.assertLogged(Level.ERROR,
                "JWT claims string is empty");
    }

    @Test
    void testValidateJwtToken_UnsupportedJwtException() {

        String unsupportedToken = Jwts.builder().setIssuedAt(new Date()).compact();
        assertFalse(jwtUtils.validateJwtToken(unsupportedToken));
        logSpy.assertLogged(Level.ERROR,
                "JWT token is unsupported");
    }

    private String getToken() {
        UserDetails userDetails = new UserDetailsImpl(
                1L,
                NAME,
                "Cedric",
                "Faraud",
                true,
                "password");
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);
        String token = jwtUtils.generateJwtToken(authentication);
        return token;
    }
}
