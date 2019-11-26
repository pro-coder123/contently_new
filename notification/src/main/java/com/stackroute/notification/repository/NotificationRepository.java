package com.stackroute.notification.repository;

import com.stackroute.notification.domain.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface NotificationRepository extends MongoRepository<Notification,Integer>
{

    @Query("{'receiver' : ?0}")
    List<Notification> findByReceiver(String receiver);



}
