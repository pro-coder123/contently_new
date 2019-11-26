package com.stackroute.usermanagement.exceptions;


import com.stackroute.usermanagement.model.AuthenticationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsExceptions.class)
    public ResponseEntity<String> handleAlreadyExistsException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("Username Already Exists", HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserDoesNotExistException.class)
    public ResponseEntity<String> handleUserDoesNotException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("User Does Not Exist", HttpStatus.CONFLICT);
    }
    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<String> handleInternalServerErrorException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<AuthenticationResponse> handleInvalidCredentialException(HttpServletRequest request, Exception ex){
        AuthenticationResponse a=new AuthenticationResponse();
        a.setAuthResponse("Username/Password is invalid");
        return new ResponseEntity<>(a, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(InvalidRoleInfoException.class)
    public ResponseEntity<String> invalidRoleException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("Role Does Not Exist", HttpStatus.CONFLICT);
    }
}
