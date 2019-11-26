package com.stackroute.usermanagement.service;

import com.stackroute.usermanagement.exceptions.*;
import com.stackroute.usermanagement.model.User;

import java.util.List;

public interface UserService {

    User saveUser(User user) throws UserAlreadyExistsExceptions,InternalServerErrorException;

    User findByUsername(User user) throws InternalServerErrorException, InvalidCredentialException;

    User deleteUser(String username) throws UserDoesNotExistException,InternalServerErrorException;

    User updateUser(User user) throws UserDoesNotExistException,InternalServerErrorException;

    User getByUsername(String username);

}
