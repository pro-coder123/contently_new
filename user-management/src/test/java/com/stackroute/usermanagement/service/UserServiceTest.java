package com.stackroute.usermanagement.service;

import com.stackroute.usermanagement.exceptions.*;
import com.stackroute.usermanagement.model.User;
import com.stackroute.usermanagement.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    User user;

    //Create a mock for UserRepository
    @Mock
    UserRepository userRepository;

    //Inject the mocks as dependencies into UserServiceImpl
    @InjectMocks
    UserServiceImpl userService;
    private String firstname="Shivani";
    private  String lastname="sajjan";
    private String dob="26/08/1998";
    private String role="reader";
    private String email="shivanisajjan@gmail.com";
    private String gender="female";
    private String national="Indian";
    private String address1="vallabh nagar";
    private String address2="wanaparthy";
    private String address3="Mahabubnagar";


    @Before
    public void setUp(){
        //Initialising the mock object
        MockitoAnnotations.initMocks(this);
        user = new User(5L,firstname, BCrypt.hashpw("shivani", BCrypt.gensalt()),firstname,lastname,dob,role,email,9145533692L,gender,national,address1,address2,address3);
    }

    @Test
    public void saveUserTestSuccess() throws UserAlreadyExistsExceptions,  InternalServerErrorException {

        when(userRepository.save(any())).thenReturn(user);
        userService.saveUser(user);
        verify(userRepository,times(1)).save(user);
        verify(userRepository,times(1)).findByUsername(firstname);
    }


    @Test(expected = UserAlreadyExistsExceptions.class)
    public void saveUserTestFailure1() throws UserAlreadyExistsExceptions, InternalServerErrorException {
       when(userRepository.findByUsername(any())).thenReturn(user);
        userService.saveUser(user);
    }
    @Test
    public void getUserByUsernameTestSuccess() throws InvalidCredentialException, InternalServerErrorException {
        User user1 = new User(5L,firstname, "shivani",firstname,lastname,dob,role,email,9145533692L,gender,national,address1,address2,address3);
        when(userRepository.findByUsername(any())).thenReturn(user);
        userService.findByUsername(user1);
        //verify here verifies that userRepository save method is only called once
        verify(userRepository,times(1)).findByUsername(firstname);
    }
    @Test(expected = InvalidCredentialException.class)
    public void getUserByUsernameTestFailure() throws InvalidCredentialException, InternalServerErrorException {
        User user1 = new User(5L,firstname, "shivanisajjan",firstname,lastname,dob,role,email,9145533692L,gender,national,address1,address2,address3);
        when(userRepository.findByUsername(any())).thenReturn(user);
        userService.findByUsername(user1);
    }
    @Test(expected = InvalidCredentialException.class)
    public void getUserByUsernameTestFailure1() throws InvalidCredentialException, InternalServerErrorException {
        when(userRepository.findByUsername(any())).thenReturn(null);
        userService.findByUsername(user);
    }
    @Test
    public void deleteUserTestSuccess() throws UserDoesNotExistException, InternalServerErrorException {
        when(userRepository.findByUsername(any())).thenReturn(user);
        userService.deleteUser(firstname);
        //verify here verifies that userRepository save method is only called once
        verify(userRepository,times(1)).findByUsername(firstname);
        verify(userRepository,times(1)).delete(user);
    }
    @Test(expected = UserDoesNotExistException.class)
    public void deleteUserTestFailure() throws UserDoesNotExistException, InternalServerErrorException {
        when(userRepository.findByUsername(any())).thenReturn(null);
        userService.deleteUser(firstname);
    }
    @Test
    public void updateUserTestSuccess() throws UserDoesNotExistException, InternalServerErrorException {
        when(userRepository.findByUsername(any())).thenReturn(user);
        userService.updateUser(user);
        //verify here verifies that userRepository save method is only called once
        verify(userRepository,times(1)).findByUsername(firstname);
        verify(userRepository,times(1)).save(user);
    }
    @Test(expected = UserDoesNotExistException.class)
    public void updateUserTestFailure() throws UserDoesNotExistException, InternalServerErrorException {
        when(userRepository.findByUsername(any())).thenReturn(null);
        userService.updateUser(user);
    }
}
