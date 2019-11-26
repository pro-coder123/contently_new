package com.stackroute.contentservice.controller;


import com.fasterxml.jackson.databind.ObjectMapper;

import com.netflix.discovery.converters.Auto;
import com.stackroute.contentservice.exceptions.ContentAlreadyExistsExceptions;
import com.stackroute.contentservice.exceptions.ContentDoesNotExistException;
import com.stackroute.contentservice.exceptions.GlobalExceptionHandler;
import com.stackroute.contentservice.exceptions.InternalServerErrorException;
import com.stackroute.contentservice.model.Content;
import com.stackroute.contentservice.service.ContentService;
import com.stackroute.contentservice.service.RabbitMQSender;
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

@WebMvcTest
@RunWith(SpringRunner.class)
public class ContentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Content content;
    private List<Content> list;
    @MockBean
    private ContentService contentService;
    @MockBean
    private RabbitMQSender rabbitMQSender;
    @InjectMocks
    private ContentController contentController;

    @Before
    public void setUp(){

        list = new ArrayList<>();
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(contentController).setControllerAdvice(new GlobalExceptionHandler()).build();
        content = new Content();
        content.setId(4);
        content.setTitle("TestTitle");
        content.setDescription("TestDescription");
        content.setAuthorName("Varun");
        list.add(content);
    }

    @Test
    public void setContentRegistry() throws Exception {
        when(contentService.saveContent(any())).thenReturn(content);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/content")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void setContentFailure() throws Exception {
        when(contentService.saveContent(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/content")
        .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void deleteContent() throws Exception{
        when(contentService.saveContent(any())).thenReturn(content);
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/delete/123")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());


    }
    @Test
    public void deleteContentFailure() throws Exception{
        when(contentService.deleteContent(anyInt())).thenThrow(ContentDoesNotExistException.class);
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/delete/123")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isConflict())
                .andDo(MockMvcResultHandlers.print());


    }
    @Test
    public void updateContent() throws Exception{
        when(contentService.updateContent(any())).thenReturn(content);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/update")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());


    }
    @Test
    public void updateContentFailure() throws Exception{
        when(contentService.updateContent(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/update")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());


    }
    @Test
    public void getContentByName() throws Exception{
        when(contentService.findByName(any())).thenReturn(list);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/contents/Varun")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());


    }

    @Test
    public void getContentByNameFailure() throws Exception{
        when(contentService.findByName(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/contents/Bruhbbh")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());


    }
    @Test
    public void getTitleById() throws Exception{

        int id = content.getId();
        System.out.println("id = "+id);
        String ID = Integer.toString(id);

        when(contentService.findTitleById(anyInt())).thenReturn(content);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/content/id/"+ID)
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());


    }
    @Test
    public void getTitleByIdFailure() throws Exception{

        int id = content.getId();
        String ID = Integer.toString(id);


        when(contentService.findTitleById(anyInt())).thenThrow(ContentDoesNotExistException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/content/id/123455")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isConflict())
                .andDo(MockMvcResultHandlers.print());


    }
    @Test
    public void getTitleByIdFailure2() throws Exception{



        when(contentService.findTitleById(anyInt())).thenThrow(ContentDoesNotExistException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/content/id/123455")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(content)))
                .andExpect(MockMvcResultMatchers.status().isConflict())
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
