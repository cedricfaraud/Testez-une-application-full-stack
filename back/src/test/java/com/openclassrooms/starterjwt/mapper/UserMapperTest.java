package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;

@SpringBootTest
public class UserMapperTest {
    private static final Long ID = 1L;
    private static final Long ID_2 = 2L;
    private static final String FIRSTNAME = "Cedric";
    private static final String LASTNAME = "Faraud";
    private static final String EMAIL = "cedric@studio.com";
    private static final String PASSWORD = "password";
    @Autowired
    private UserMapper userMapper;

    @Test
    void testToEntity() {
        UserDto userDto = getUserDto(ID);

        User user = userMapper.toEntity(userDto);

        assertNotNull(user);
        assertEquals(userDto.getId(), user.getId());
    }

    @Test
    void testToEntityList() {
        List<UserDto> userDtoList = new ArrayList<UserDto>();
        userDtoList.add(getUserDto(ID));
        userDtoList.add(getUserDto(ID_2));

        List<User> userList = userMapper.toEntity(userDtoList);

        assertNotNull(userList);
        assertEquals(userDtoList.get(1).getId(), userList.get(1).getId());
    }

    @Test
    void testToDto() {
        User user = getUser(ID);

        UserDto userDto = userMapper.toDto(user);

        assertNotNull(userDto);
        assertEquals(user.getId(), userDto.getId());
    }

    @Test
    void testToDtoList() {
        List<User> userList = new ArrayList<User>();
        userList.add(getUser(ID));
        userList.add(getUser(ID_2));

        List<UserDto> userDtoList = userMapper.toDto(userList);

        assertNotNull(userDtoList);
        assertEquals(userList.get(1).getId(), userDtoList.get(1).getId());
    }

    private User getUser(Long id) {
        User user = new User();
        user.setId(id);
        user.setFirstName(FIRSTNAME);
        user.setLastName(LASTNAME);
        user.setEmail(EMAIL);
        user.setPassword(PASSWORD);
        user.setAdmin(false);
        return user;
    }

    private UserDto getUserDto(Long id) {
        UserDto userDto = new UserDto();

        userDto.setId(id);
        userDto.setFirstName(FIRSTNAME);
        userDto.setLastName(LASTNAME);
        userDto.setEmail(EMAIL);
        userDto.setPassword(PASSWORD);
        userDto.setAdmin(false);
        return userDto;
    }
}
