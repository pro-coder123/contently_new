package com.stackroute.purchasingservice.service;



import com.stackroute.purchasingservice.model.Purchase;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${purchasing.rabbitmq.exchange}")
    private String exchange;

    @Value("${purchasing.rabbitmq.routingkey}")
    private String routingkey;


    public void sendContent(Purchase purchase) {
        rabbitTemplate.convertAndSend(exchange, routingkey, purchase);
        System.out.println("Send msg = " + purchase.getId());
    }

}