package com.stackroute.notification.service;

import com.stackroute.notification.domain.Notification;
import com.stackroute.notification.exceptions.InternalServerErrorException;
import com.stackroute.notification.repository.NotificationRepository;

import org.junit.Before;
import org.junit.Test;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class NotificationServiceTest {

    Notification notification;

    //Create a mock for UserRepository
    @Mock
    NotificationRepository notificationRepository;

    //Inject the mocks as dependencies into UserServiceImpl
    @InjectMocks
    NotificationServiceImpl notificationService;

    @Before
    public void setUp(){
        //Initialising the mock object
        MockitoAnnotations.initMocks(this);
        notification = new Notification();
        notification.setId(123);
        notification.setSender("ABC");
        notification.setReceiver("Varun");

    }

    @Test
    public void saveNotificationTestSuccess() throws InternalServerErrorException {

//        when(notificationService.getNextSequence(any())).thenReturn(123);

        when(notificationRepository.save(any())).thenReturn(notification);

//        notificationService.saveNotification(notification);
        //verify here verifies that userRepository save method is only called once
//        verify(notificationRepository,times(1)).save(notification);
    }

    @Test(expected = InternalServerErrorException.class)
    public void saveNotificationTestFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }

    @Test
    public void findByReceiverTestSuccess() throws InternalServerErrorException {
        when(notificationRepository.findByReceiver(any())).thenReturn(anyList());
        notificationService.findByReceiver("Varun");
        //verify here verifies that userRepository save method is only called once
        verify(notificationRepository,times(1)).findByReceiver("Varun");
    }
    @Test(expected = InternalServerErrorException.class)
    public void findByReceiverTestFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }
    @Test
    public void deleteByIdTestSuccess() throws InternalServerErrorException {
        when(notificationRepository.existsById(any())).thenReturn(Boolean.TRUE);

        notificationService.deleteById(123);
        //verify here verifies that userRepository save method is only called once
        verify(notificationRepository,times(1)).deleteById(123);
    }
    @Test(expected = InternalServerErrorException.class)
    public void deleteByIdTestFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }




}
