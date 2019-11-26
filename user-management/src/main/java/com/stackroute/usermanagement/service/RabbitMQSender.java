package com.stackroute.usermanagement.service;


import com.stackroute.usermanagement.model.DTOUser;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${registry.rabbitmq.exchange}")
    private String exchange;

    @Value("${registry.rabbitmq.routingkey}")
    private String routingkey;

    @Value("${registry1.rabbitmq.exchange}")
    private String exchange1;

    @Value("${registry1.rabbitmq.routingkey}")
    private String routingkey1;


    public void sendRegistry(DTOUser user) {
        rabbitTemplate.convertAndSend(exchange, routingkey, user);
    }
    public void sendRegistry1(DTOUser user) {
        rabbitTemplate.convertAndSend(exchange1, routingkey1, user);
    }

}