package com.stackroute.contentservice.service;

import com.stackroute.contentservice.exceptions.ContentAlreadyExistsExceptions;
import com.stackroute.contentservice.exceptions.ContentDoesNotExistException;
import com.stackroute.contentservice.exceptions.InternalServerErrorException;
import com.stackroute.contentservice.exceptions.NullValueFieldException;
import com.stackroute.contentservice.model.Content;
import com.stackroute.contentservice.model.ContentDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQConsumer {

    ContentService contentService;

    public RabbitMQConsumer() {

    }

    @Autowired
    public RabbitMQConsumer(ContentService contentService) {
        this.contentService = contentService;
    }

    @RabbitListener(queues = "plagarism_queue")
    public void recievedMessage(ContentDTO contentDTO) throws ContentDoesNotExistException, NullValueFieldException, InternalServerErrorException, ContentAlreadyExistsExceptions {
        System.out.println("Content:"+contentDTO);
        Content content=contentService.findTitleById(contentDTO.getId());
        content.setPlagarised(contentDTO.isPlagarized());
        System.out.println("status"+contentDTO.isPlagarized());
        content.setPlagarismCheckDone(contentDTO.isPlagCheckingDone());
        System.out.println("Check:"+contentDTO.isPlagCheckingDone());
        contentService.saveContent(content);
    }
}
