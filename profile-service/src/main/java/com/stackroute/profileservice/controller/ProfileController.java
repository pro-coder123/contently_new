package com.stackroute.profileservice.controller;

import com.stackroute.profileservice.model.Chapter;
import com.stackroute.profileservice.model.Profile;
import com.stackroute.profileservice.service.ProfileService;
import com.stackroute.profileservice.service.RabbitMQSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/profile")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProfileController {
    private ProfileService profileService;
    private ResponseEntity responseEntity;
    private RabbitMQSender rabbitMQSender;


    @Autowired
    public ProfileController(ProfileService profileService, RabbitMQSender rabbitMQSender) {
        this.profileService = profileService;
        this.rabbitMQSender = rabbitMQSender;
    }


    @PostMapping
    public ResponseEntity<Profile> saveProfile(@RequestBody Profile profile) {
        responseEntity = new ResponseEntity<>(this.profileService.saveProfile(profile), HttpStatus.CREATED);
        return responseEntity;
    }

    @GetMapping("/username/{name}")
    public double getCost(@PathVariable String name) {
        return profileService.getByname(name);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteProfile(@RequestBody int id) {
        profileService.deleteProfile(id);
        responseEntity = new ResponseEntity<>("Successfully deleted", HttpStatus.OK);
        return responseEntity;
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Profile>> getByRole(@PathVariable String role) {
        profileService.getByRole(role);
        responseEntity = new ResponseEntity<>(profileService.getByRole(role), HttpStatus.OK);
        return responseEntity;
    }

    @PutMapping("/update")
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile) {
        Profile profile1 = profileService.update(profile);
        responseEntity = new ResponseEntity<>(profile1, HttpStatus.OK);
        rabbitMQSender.sendProfile(profile1);
        return responseEntity;
    }

    @GetMapping("/chapter/{username}/{id}")
    public ResponseEntity<Chapter> chapterRelease(@PathVariable("username") String username, @PathVariable("id") int id) throws ParseException {
        responseEntity = new ResponseEntity<>(profileService.getCurrentChapter(username, id), HttpStatus.OK);
        return responseEntity;
    }


    @PostMapping("/release/{username}/{id}")
    public ResponseEntity<Chapter> releaseNext(@PathVariable("username") String username, @PathVariable("id") int id) {
        responseEntity = new ResponseEntity<>(profileService.updateReleaseNext(username, id), HttpStatus.OK);
        return responseEntity;
    }

}
