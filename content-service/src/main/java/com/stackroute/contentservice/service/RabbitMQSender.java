package com.stackroute.contentservice.service;


import com.stackroute.contentservice.model.Content;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${content.rabbitmq.exchange}")
    private String exchange;

    @Value("${content.rabbitmq.routingkey}")
    private String routingkey;


    public void sendContent(Content content) {
        rabbitTemplate.convertAndSend(exchange, routingkey, content);
    }

}