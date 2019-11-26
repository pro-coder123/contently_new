package com.stackroute.contentservice.service;

import com.stackroute.contentservice.exceptions.ContentAlreadyExistsExceptions;
import com.stackroute.contentservice.exceptions.ContentDoesNotExistException;
import com.stackroute.contentservice.exceptions.InternalServerErrorException;
import com.stackroute.contentservice.exceptions.NullValueFieldException;
import com.stackroute.contentservice.model.Content;

import java.util.List;


public interface ContentService {


    Content saveContent(Content content) throws ContentAlreadyExistsExceptions, NullValueFieldException,InternalServerErrorException;

   Content findByTitle(String title) throws InternalServerErrorException;

   Content deleteContent(int id) throws ContentDoesNotExistException,InternalServerErrorException;

   Content updateContent(Content content) throws ContentDoesNotExistException,InternalServerErrorException;

    List<Content> findByName(String name) throws InternalServerErrorException;

    Content findTitleById(int id) throws ContentDoesNotExistException;

    int getNextSequence(String seq);
}
