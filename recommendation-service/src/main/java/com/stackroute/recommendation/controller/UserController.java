package com.stackroute.recommendation.controller;

import com.stackroute.recommendation.domain.*;
import com.stackroute.recommendation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("api/v1")
public class UserController {
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    UserService userService;

    @GetMapping("books/recommendation/{name}")
    public Collection<Book> getBooksRecommendation(@PathVariable String name){return userService.getBooksRecommendation(name);}

    @GetMapping("books/trending")
    public Collection<Book> getTrending(){return userService.getTrending();}


    @GetMapping("editor/{genre}")
    public Collection<User> getEditorRec(@PathVariable String genre){return userService.getEditorRec(genre);}

    @GetMapping("illustrator/{genre}")
    public Collection<User> getillustratorRec(@PathVariable String genre){return userService.getIllustratorRec(genre);}


    @PostMapping("priceRec")
    public int getPriceRec(@RequestBody PriceRec priceRec)
    {
        return userService.getPriceRec(priceRec);
    }


}
