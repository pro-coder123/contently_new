package com.stackroute.recommendation.config;

import com.stackroute.recommendation.domain.User;
import com.stackroute.recommendation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component


public class Initializer implements CommandLineRunner {

 @Autowired
UserService userService;
 @Autowired
 User user;
    @Override

    public void run(String...args) throws Exception {

        System.out.println("command line runner working");






//        userService.dop();
//        userService.pop();
//        userService.bob();



//        userService.top();

}}
