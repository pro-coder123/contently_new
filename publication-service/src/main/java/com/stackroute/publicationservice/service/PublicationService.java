package com.stackroute.publicationservice.service;

import com.stackroute.publicationservice.exceptions.ContentAlreadyExistsExceptions;
import com.stackroute.publicationservice.exceptions.ContentDoesNotExistException;
import com.stackroute.publicationservice.exceptions.InternalServerErrorException;
import com.stackroute.publicationservice.exceptions.NullValueFieldException;
import com.stackroute.publicationservice.model.Publications;

import java.util.List;


public interface PublicationService {


    Publications saveContent(Publications publications) throws ContentAlreadyExistsExceptions, NullValueFieldException, InternalServerErrorException;

    List<Publications> getAllPublications() throws InternalServerErrorException;

   List<Publications> findByTitle(String title);

    List<Publications> findByName(String username);

    void deleteContent(int id) throws ContentDoesNotExistException,InternalServerErrorException;

   Publications updateContent(Publications publications) throws ContentDoesNotExistException,InternalServerErrorException;

    public List<Publications> searchQuery(String searchQuery);

    Publications findById(int id) throws ContentDoesNotExistException;

    public List<Publications> findAllByTitle(String searchValue);


}
