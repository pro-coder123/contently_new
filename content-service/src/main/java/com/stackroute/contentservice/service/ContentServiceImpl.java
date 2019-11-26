package com.stackroute.contentservice.service;


import com.stackroute.contentservice.sequence.Custom;
import com.stackroute.contentservice.exceptions.ContentAlreadyExistsExceptions;
import com.stackroute.contentservice.exceptions.ContentDoesNotExistException;
import com.stackroute.contentservice.exceptions.InternalServerErrorException;
import com.stackroute.contentservice.exceptions.NullValueFieldException;
import com.stackroute.contentservice.model.Content;
import com.stackroute.contentservice.repository.ContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class ContentServiceImpl implements ContentService {

    @Autowired
    private ContentRepository contentRepository;
    @Autowired
    private MongoOperations mongo;

    public Content saveContent(Content content) throws InternalServerErrorException {
        try {
            return contentRepository.save(content);
        }
        catch (Exception e){
            throw new InternalServerErrorException();
        }
    }

   public Content findByTitle(String title) throws InternalServerErrorException {
        try {
            return contentRepository.findByTitle(title);
        }
        catch(Exception ex){
            throw new InternalServerErrorException();
        }


    }

    @Override
    public Content deleteContent(int id) throws ContentDoesNotExistException, InternalServerErrorException {
        try
        {
            Content content = contentRepository.findById(id).get();
            contentRepository.delete(content);
            return content;
        }
        catch(Exception e)
        {
            throw new ContentDoesNotExistException();
        }    
    }
    @Override
    public Content updateContent(Content content) throws ContentDoesNotExistException,InternalServerErrorException{
        if(contentRepository.findById(content.getId()).isPresent()){
            return contentRepository.save(content);
        }
        else
        {
            throw new ContentDoesNotExistException();
        }
    }


    public List<Content> findByName(String name) throws InternalServerErrorException
    {
        List<Content> contentList=new ArrayList<>();
        System.out.println("name:"+name);
        try
        {
            List<Content> content=contentRepository.findByName(name);
            if(content.get(0).getAuthorName().equals(name)){
                System.out.println("I am Author");
                return contentRepository.findByName(name);
            }
            else {
                if (content.get(0).getEditorName()!=null && content.get(0).getEditorName().equals(name)) {
                    System.out.println("I an editor");
                    for (Content content1 : content) {
                        if (content1.getEditorStatus().equals("confirmed")) {
                            System.out.println(":Content:"+content1);
                            contentList.add(content1);
                        }
                    }
                    return contentList;
                }
                else {
                    System.out.println("I am designer");
                    for(Content content1:content){
                        if(content1.getDesignerStatus().equals("confirmed")){
                            contentList.add(content1);
                        }
                    }
                    return contentList;
                }
            }
        }
        catch (Exception e)
        {
            System.out.println("Exception");
            throw new InternalServerErrorException();
        }
    }

    @Override
    public Content findTitleById(int id) throws ContentDoesNotExistException {
        Content content=contentRepository.findById(id).get();
        if(content==null){
            throw new ContentDoesNotExistException();
        }
        return content;
    }


    public int getNextSequence(String seqName)
        {
            Custom counter = mongo.findAndModify(
                    query(where("_id").is(seqName)),
                    new Update().inc("seq",1),
                    options().returnNew(true).upsert(true),
                    Custom.class);
            return counter.getSeq();
        }

}
