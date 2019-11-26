package com.stackroute.profileservice.service;

import com.stackroute.profileservice.model.Interest;
import com.stackroute.profileservice.model.Profile;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${profile.rabbitmq.exchange}")
    private String exchange;

    @Value("${profile.rabbitmq.routingkey}")
    private String routingkey;


    public void sendProfile(Profile profile)
    {

        String toSendGenre="";
        List<Interest> interest= profile.getInterest();
        for (int i=0;i<interest.size();i++)
        {
            List<String> genreList=interest.get(i).getGenre();
            for (int j=0;j<genreList.size();j++)
            {
                toSendGenre=toSendGenre+"/"+genreList.get(j);
            }
        }


        toSendGenre=toSendGenre+"pop"+profile.getUsername()+"pop"+profile.getExperience()+"pop"+profile.getCost();

        rabbitTemplate.convertAndSend(exchange, routingkey, toSendGenre);


    }

}
