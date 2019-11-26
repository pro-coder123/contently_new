package com.stackroute.profileservice.service;

import com.stackroute.profileservice.model.DTOUser;
import com.stackroute.profileservice.model.Profile;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQConsumer {

    ProfileService profileService;

    public RabbitMQConsumer() {

    }

    @Autowired
    public RabbitMQConsumer(ProfileService profileService) {
        this.profileService = profileService;
    }

    @RabbitListener(queues = "registry_queue1")
    public void recievedMessage(DTOUser userDto) {
        int i = userDto.getId().intValue();
        Profile profile = new Profile();
        profile.setId(i);
        profile.setUsername(userDto.getUsername());
        profile.setRole(userDto.getRole());
        this.profileService.saveProfile(profile);
    }
}
