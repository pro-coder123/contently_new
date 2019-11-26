package com.stackroute.contentservice.service;


import com.stackroute.contentservice.exceptions.*;
import com.stackroute.contentservice.model.Content;
import com.stackroute.contentservice.repository.ContentRepository;
import org.junit.Before;
import org.junit.Test;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ContentServiceTest {

    Content content;

    //Create a mock
    @Mock
    ContentRepository contentRepository;

    //Inject the mocks as dependencies
    @InjectMocks
    ContentServiceImpl contentService;

    List<Content> list;

    @Before
    public void setUp(){

        MockitoAnnotations.initMocks(this);

        content = new Content();
        content.setId(123);
        content.setTitle("TestTitle");
        content.setDescription("TestDescription");
        content.setAuthorName("Varun");
        list = new ArrayList<>();
        list.add(content);
    }

    @Test
    public void saveContentTestSuccess() throws InternalServerErrorException, ContentAlreadyExistsExceptions, NullValueFieldException{

        when(contentRepository.save(any())).thenReturn(content);
        Content content = contentService.saveContent(this.content);
        //verify here verifies that contentRepository save method is only called once
        verify(contentRepository,times(1)).save(this.content);
    }

    @Test(expected = InternalServerErrorException.class)
    public void saveContentTestFailure() throws InternalServerErrorException {
        Content content = new Content();
        throw new InternalServerErrorException();
    }
    @Test
    public void findByTitleTestSuccess() throws InternalServerErrorException, ContentDoesNotExistException {

        when(contentRepository.findByTitle(any())).thenReturn(content);
        Content content = contentService.findByTitle(this.content.getTitle());
        //verify here verifies that contentRepository save method is only called once
        verify(contentRepository,times(1)).findByTitle(this.content.getTitle());
    }

    @Test(expected = InternalServerErrorException.class)
    public void findByTitleTestFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }



    @Test(expected = InternalServerErrorException.class)
    public void deleteContentFailure() throws InternalServerErrorException,ContentDoesNotExistException{
        throw new InternalServerErrorException();
    }


    @Test(expected = InternalServerErrorException.class)
    public void updateContentFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }


    @Test
    public void findByNameSuccess() throws InternalServerErrorException {
        when(contentRepository.findByName(any())).thenReturn(list);

        List<Content> l = contentService.findByName(content.getAuthorName());
        //verify here verifies that contentRepository save method is only called once
        verify(contentRepository,times(2)).findByName(content.getAuthorName());
    }

    @Test(expected = InternalServerErrorException.class)
    public void findByNameFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }


    @Test(expected = InternalServerErrorException.class)
    public void findByIdFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }


}
