package com.stackroute.purchasingservice.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(NullValueFieldException.class)
    public ResponseEntity<?> handleNullValueException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<String>("Enter Proper Value", HttpStatus.NOT_ACCEPTABLE);
    }


    @ExceptionHandler(InternalServerErrorException.class)
    public ResponseEntity<?> handleInternalServerErrorException(HttpServletRequest request, Exception ex){
        return new ResponseEntity<String>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
