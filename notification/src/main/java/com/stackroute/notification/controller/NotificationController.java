package com.stackroute.notification.controller;


import com.stackroute.notification.domain.Notification;
import com.stackroute.notification.exceptions.InternalServerErrorException;
import com.stackroute.notification.service.NotificationService;
import com.stackroute.notification.service.RabbitMQSender;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
@CrossOrigin
public class NotificationController {

    NotificationService notificationService;

    private final SimpMessagingTemplate template;
    private RabbitMQSender rabbitMQSender;
    @Autowired
    NotificationController(NotificationService notificationService, SimpMessagingTemplate template, RabbitMQSender rabbitMQSender){

        this.notificationService = notificationService;
        this.template = template;
        this.rabbitMQSender = rabbitMQSender;
    }



    @RabbitListener(queues = "notification-queue")
    public void recievedMessage(Notification notification) {

        this.template.convertAndSendToUser(notification.getReceiver(),"/notif",notification.getMessage());

    }

    @PostMapping(value = "/send")
    public ResponseEntity<?> saveNotification(@RequestBody Notification notification) throws InternalServerErrorException
    {
        rabbitMQSender.send(notification);
        return new ResponseEntity<>(notificationService.saveNotification(notification), HttpStatus.CREATED);
    }
    @GetMapping(value = "/{receiver}")
    public ResponseEntity<?> getByReceiver(@PathVariable("receiver") String receiver) throws InternalServerErrorException
    {
        return new ResponseEntity<>(notificationService.findByReceiver(receiver), HttpStatus.OK);
    }
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<?> deleteNotif(@PathVariable int id){
        System.out.println("id:"+id);
        int deletedID=notificationService.deleteById(id);
        System.out.println("After");
        return new ResponseEntity<String>("Deleted Successfully",HttpStatus.OK);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<?> updateStatus(@RequestBody List<Notification> notifications){
        return new ResponseEntity<>(notificationService.updateNotif(notifications),HttpStatus.OK);
    }
}