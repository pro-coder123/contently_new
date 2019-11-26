package com.stackroute.notification.service;

import com.stackroute.notification.domain.Notification;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("notification-exchange")
    private String exchange;

    @Value("notification-routingKey")
    private String routingkey;

    public void send(Notification notification) {
        rabbitTemplate.convertAndSend(exchange, routingkey, notification);

    }
}