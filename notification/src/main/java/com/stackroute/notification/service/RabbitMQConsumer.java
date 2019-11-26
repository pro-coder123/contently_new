//package com.stackroute.notification.service;
//
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.stereotype.Component;
//
//
//@Component
//@org.springframework.stereotype.Controller
//@MessageMapping("/send")
//public class RabbitMQConsumer {
//
//    @RabbitListener(queues = "${javainuse.rabbitmq.queue}")
//    public void recievedMessage(String message) {
//
//        this.template.convertAndSend("/chat","MEssage REcieved");
//
//
//
//
//    }
//}