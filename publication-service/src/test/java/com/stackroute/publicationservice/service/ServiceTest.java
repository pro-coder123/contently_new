package com.stackroute.publicationservice.service;

import com.stackroute.publicationservice.exceptions.ContentDoesNotExistException;
import com.stackroute.publicationservice.exceptions.InternalServerErrorException;
import com.stackroute.publicationservice.model.Publications;
import com.stackroute.publicationservice.repository.PublicationRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

public class ServiceTest {

    Publications publications;

    @Mock
    PublicationRepository publicationRepository;

    @Mock
    private MongoOperations mongo;

    @InjectMocks
    PublicationServiceImpl publicationService;

    public List<Publications> list;


    @Before
    public void setUp() {
        //Initialising the mock object
        MockitoAnnotations.initMocks(this);
        publications = new Publications();

        publications.setId(123);
        publications.setTitle("Varun");

        list = new ArrayList();
        list.add(publications);
    }
    @Test
    public void saveNotificationTestSuccess() throws InternalServerErrorException {

        when(publicationRepository.save(any())).thenReturn(publications);
    }

    @Test(expected = InternalServerErrorException.class)
    public void saveNotificationTestFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }
    @Test
    public void deleteContentTestSuccess() throws InternalServerErrorException,ContentDoesNotExistException{
        publicationService.deleteContent(123);
        verify(publicationRepository,times(1)).deleteById(123);
    }

    @Test(expected = ContentDoesNotExistException.class)

    public void deleteContentTestFailure() throws ContentDoesNotExistException,InternalServerErrorException {

            throw new ContentDoesNotExistException();

    }

    @Test(expected = ContentDoesNotExistException.class)
    public void updateTestFailure() throws InternalServerErrorException, ContentDoesNotExistException {




        when(publicationRepository.save(anyObject())).thenReturn(publications);

        publicationService.updateContent(publications);

        verify(publicationRepository,times(1)).save(publications);


    }





}
