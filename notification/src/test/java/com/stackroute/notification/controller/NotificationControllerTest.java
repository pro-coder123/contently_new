package com.stackroute.notification.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.notification.domain.Notification;
import com.stackroute.notification.exceptions.GlobalExceptionHandler;
import com.stackroute.notification.exceptions.InternalServerErrorException;
import com.stackroute.notification.service.NotificationService;
import com.stackroute.notification.service.RabbitMQSender;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@WebMvcTest
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;
    private Notification notification;
    @MockBean
    private NotificationService notificationService;
    @MockBean
    private RabbitMQSender rabbitMQSender;

    @MockBean
    private SimpMessagingTemplate template;

    @InjectMocks
    private NotificationController notificationController;



    private List<Notification> list =null;

    @Before
    public void setUp(){

        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).setControllerAdvice(new GlobalExceptionHandler()).build();
        notification = new Notification();
        notification.setId(123);
        notification.setSender("ABC");
        notification.setReceiver("Varun");

        list = new ArrayList();
        list.add(notification);
    }

    @Test
    public void saveNotificationSuccess() throws Exception {
        when(notificationService.saveNotification(any())).thenReturn(notification);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/send")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(notification)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andDo(MockMvcResultHandlers.print());
    }
    @Test
    public void saveNotificationFailure() throws Exception {
        when(notificationService.saveNotification(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/send")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(notification)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());
    }


    @Test
    public void getNotificationSuccess() throws Exception {
        when(notificationService.findByReceiver(any())).thenReturn(list);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/Varun")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(notification)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }
    @Test
    public void getNotificationFailure() throws Exception {
        when(notificationService.findByReceiver(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/Varun")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(notification)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void deleteNotificationSuccess() throws Exception {
        when(notificationService.deleteById(anyInt())).thenReturn(anyInt());
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/delete/123")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(notification)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }









    private static String asJsonString(final Object obj)
    {
        try{
            return new ObjectMapper().writeValueAsString(obj);

        }catch(Exception e){
            throw new RuntimeException(e);
        }
    }










}
