package com.stackroute.publicationservice.controller;


import com.stackroute.publicationservice.exceptions.ContentAlreadyExistsExceptions;
import com.stackroute.publicationservice.exceptions.ContentDoesNotExistException;
import com.stackroute.publicationservice.exceptions.InternalServerErrorException;
import com.stackroute.publicationservice.exceptions.NullValueFieldException;
import com.stackroute.publicationservice.model.Publications;
import com.stackroute.publicationservice.model.PublicationsDto;
import com.stackroute.publicationservice.service.PublicationService;
import com.stackroute.publicationservice.service.RabbitMQSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1")
public class PublicationController {

    private PublicationService publicationService;
    private RabbitMQSender rabbitMQSender;
    private ResponseEntity responseEntity;
    private PublicationsDto publicationsDto;

    @Autowired
    public PublicationController(PublicationService publicationService, RabbitMQSender rabbitMQSender,PublicationsDto publicationsDto) {
        this.publicationService = publicationService;
        this.rabbitMQSender = rabbitMQSender;
        this.publicationsDto=publicationsDto;
    }


    @PostMapping(value = "/save")
    public ResponseEntity<Publications> registerUser(@RequestBody Publications publication) throws ContentAlreadyExistsExceptions, InternalServerErrorException, NullValueFieldException {
        this.publicationsDto.setId(publication.getId());
        this.publicationsDto.setAuthorName(publication.getAuthorName());
        this.publicationsDto.setDescription(publication.getDescription());
        this.publicationsDto.setGenres(publication.getGenres());
        this.publicationsDto.setTitle(publication.getTitle());
        this.publicationsDto.setEditorName(publication.getEditorName());
        this.publicationsDto.setDesignerName(publication.getDesignerName());
        this.publicationsDto.setNoOfPurchases(publication.getNoOfPurchases());
        this.publicationsDto.setPrice(publication.getPrice());
        this.publicationsDto.setPublishedAt(publication.getPublishedAt());
        this.rabbitMQSender.sendRegistry(this.publicationsDto);
        return new ResponseEntity<Publications>(publicationService.saveContent(publication), HttpStatus.CREATED);
    }

    @GetMapping(value = "/publications")
    public ResponseEntity<?> getAllPublications() throws InternalServerErrorException {
        return new ResponseEntity<List<Publications>>(publicationService.getAllPublications(), HttpStatus.OK);
    }


    @PutMapping(value = "/update")
    public ResponseEntity<?> update(@RequestBody Publications publication) throws InternalServerErrorException, ContentDoesNotExistException {
        publicationService.updateContent(publication);
        return new ResponseEntity<Publications>(publication, HttpStatus.OK);
    }

    @GetMapping(value = "/name/{username}")
    public ResponseEntity<?> getByUsername(@PathVariable("username") String username) {
        responseEntity = new ResponseEntity<List<Publications>>(publicationService.findByName(username), HttpStatus.OK);
        return responseEntity;
    }

    @GetMapping(value = "/book/id/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") int id) throws ContentDoesNotExistException {
        responseEntity = new ResponseEntity<>(publicationService.findById(id), HttpStatus.OK);
        return responseEntity;
    }

    @GetMapping("publications/{title}")
    public ResponseEntity<?> findAllByTitle(@PathVariable("title") String title) throws InternalServerErrorException {
        responseEntity = new ResponseEntity<List<Publications>>(publicationService.findByTitle(title), HttpStatus.OK);
        return responseEntity;
    }

    @GetMapping("publications/search/{title}")
    public ResponseEntity<?> searchQuery(@PathVariable("title") String title) throws InternalServerErrorException {
        responseEntity = new ResponseEntity<List<Publications>>(publicationService.searchQuery(title), HttpStatus.OK);
        return responseEntity;
    }



}
