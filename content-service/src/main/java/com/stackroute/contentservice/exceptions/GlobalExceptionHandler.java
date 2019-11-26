package com.stackroute.contentservice.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ContentAlreadyExistsExceptions.class)
    public ResponseEntity<String> handleAlreadyExistsException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("Content Already Exists", HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NullValueFieldException.class)
    public ResponseEntity<String> handleNullValueException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("Enter Proper Value", HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(ContentDoesNotExistException.class)
    public ResponseEntity<String> handleUserDoesNotException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("Content Does Not Exist", HttpStatus.CONFLICT);
    }
    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<String> handleInternalServerErrorException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
