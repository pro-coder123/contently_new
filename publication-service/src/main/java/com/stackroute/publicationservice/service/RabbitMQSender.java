package com.stackroute.publicationservice.service;


import com.stackroute.publicationservice.model.Publications;
import com.stackroute.publicationservice.model.PublicationsDto;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${publication.rabbitmq.exchange}")
    private String exchange;

    @Value("${publication.rabbitmq.routingkey}")
    private String routingkey;


    public void sendRegistry(PublicationsDto publications) {
        rabbitTemplate.convertAndSend(exchange, routingkey, publications);
        System.out.println("msg senr-----------------------------------------");
        System.out.println("Send msg = " + publications);
    }

}