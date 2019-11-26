package com.stackroute.notification.service;

import com.stackroute.notification.domain.Notification;
import com.stackroute.notification.exceptions.InternalServerErrorException;

import java.util.List;

public interface NotificationService {

    Notification saveNotification(Notification notification) throws InternalServerErrorException;

    List<Notification> findByReceiver(String receiver) throws InternalServerErrorException;

    int deleteById(int id);

    List<Notification> updateNotif(List<Notification> notifications);

    int getNextSequence(String seq);



}
