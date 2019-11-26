package com.stackroute.awsstorage.service;


import com.stackroute.awsstorage.model.ContentDTO;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${plagarism.rabbitmq.exchange}")
    private String exchange;

    @Value("${plagarism.rabbitmq.routingkey}")
    private String routingkey;


    public void sendContent(ContentDTO contentdto) {
        rabbitTemplate.convertAndSend(exchange, routingkey, contentdto);
    }

}