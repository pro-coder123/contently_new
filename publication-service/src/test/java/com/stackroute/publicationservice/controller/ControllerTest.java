package com.stackroute.publicationservice.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.publicationservice.exceptions.GlobalExceptionHandler;
import com.stackroute.publicationservice.exceptions.InternalServerErrorException;
import com.stackroute.publicationservice.model.Publications;
import com.stackroute.publicationservice.model.PublicationsDto;
import com.stackroute.publicationservice.service.PublicationService;
import com.stackroute.publicationservice.service.RabbitMQSender;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@WebMvcTest
public class ControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Publications publications;

    @MockBean
    private PublicationService publicationService;

    @MockBean
    private RabbitMQSender rabbitMQSender;

    @MockBean
    PublicationsDto publicationsDto;

    @InjectMocks
    private PublicationController publicationController;

    public List<Publications> list;

    @Before
    public void setUp(){

        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(publicationController).setControllerAdvice(new GlobalExceptionHandler()).build();
        publications = new Publications();

        publications.setId(123);
        publications.setTitle("Varun");

        list = new ArrayList();
        list.add(publications);
    }
    @Test
    public void testRegisterSuccess() throws Exception
    {
        when(publicationService.saveContent(any())).thenReturn(publications);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/save")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(publications)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void testUpdateSuccess() throws Exception
    {
        when(publicationService.updateContent(any())).thenReturn(publications);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/update")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(publications)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void testGetSuccess() throws Exception
    {
        when(publicationService.findByTitle(any())).thenReturn(list);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/publications/Varun")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(publications)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());

    }

    @Test
    public void testRegisterFailure() throws Exception {
        when(publicationService.saveContent(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/save")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(publications)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void testUpdateFailure() throws Exception
    {
        when(publicationService.updateContent(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/update")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(publications)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
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
