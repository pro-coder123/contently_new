package com.stackroute.notification.service;

import com.stackroute.notification.domain.Notification;
import com.stackroute.notification.exceptions.InternalServerErrorException;
import com.stackroute.notification.repository.NotificationRepository;
import com.stackroute.notification.sequence.Custom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class NotificationServiceImpl implements NotificationService{

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private MongoOperations mongo;

    public Notification saveNotification(Notification notification) throws InternalServerErrorException
    {
        notification.setId(getNextSequence("customSequences"));
        try
        {
            Notification notification1 = notificationRepository.save(notification);
            return notification1;
        }
        catch (Exception e)
        {
                throw new InternalServerErrorException();
        }
    }

    public List<Notification> findByReceiver(String receiver) throws InternalServerErrorException
    {
        try {
            return notificationRepository.findByReceiver(receiver);
        }
        catch (Exception e)
        {
            throw  new InternalServerErrorException();
        }
    }

    @Override
    public int deleteById(int id){
        if(notificationRepository.existsById(id)) {
            System.out.println("Exist");
            notificationRepository.deleteById(id);
        }
        return id;
    }

    @Override
    public List<Notification> updateNotif(List<Notification> notifications) {
        List<Notification> notificationList=new ArrayList<>();
        for(Notification notification:notifications){
            System.out.println("hiiiiiiiii");
            notification.setStatus(false);
            notificationRepository.save(notification);
            System.out.println("shivaniiii");
            notificationList.add(notification);
        }
        return notificationList;
    }

    public int getNextSequence(String seqName)
    {
        Custom counter = mongo.findAndModify(
                query(where("_id").is(seqName)),
                new Update().inc("seq",1),
                options().returnNew(true).upsert(true),
                Custom.class);
        return counter.getSeq();
    }
}
