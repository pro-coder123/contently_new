package com.stackroute.recommendation.service;


import com.stackroute.recommendation.domain.*;
import com.stackroute.recommendation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user)
    {
        userRepository.save(user);
        return user;
    }
    public Collection<User> getAll(String name)
    {

        return (Collection<User>) userRepository.findAll();
    }

    public Collection<Book> bookReccomendation(String name)
    {
        return userRepository.bookReccomendation(name);
    }





    public Collection<User> getAll() {
        return (Collection<User>) userRepository.findAll();
    }


    public Collection<Book> getRecAccProfile(String name)
    {
        return userRepository.getRecAccProfile(name);
    }

    public Collection<Book> getRecAccAuth(String name)
    {
        return userRepository.getRecAccAuth(name);
    }

    public Collection<Book> getTrending()
    {
        return userRepository.getTrending();
    }

    public Collection<User> getIllustratorRec(String genre)
    {
        return userRepository.getIllustratorRec(genre);
    }

    public Collection<User> getEditorRec(String genre)
    {
        return userRepository.getEditorRec(genre);
    }

    public int getPriceRec(PriceRec priceRec)
    {
        int count=1;
        count=userRepository.getPriceRec(priceRec.getGenre()).size();
        if(count<=0)
            count=1;

        int price=priceRec.getEditorPay()+priceRec.getIllustratorPay()+priceRec.getBase()+count/10+priceRec.getNoOfWords()/1000;
        System.out.println("price="+price);
        return price;
    }

    void savePublication(String title,String author,int bookId,int nop,double price)
    {
        userRepository.savePublication(title,author,bookId,nop,price);

    }

    public void saveBookGenre(String genre,int id)
    {
        userRepository.saveBookGenre(genre,id);
    }

    public void savePurchasing(int bookId,String user)
    {
        userRepository.savePurchasing(bookId,user);

    }
    public void saveEditor(String editor,int bookId)
    {
        userRepository.saveEditor(editor,bookId);
    }
    public void saveDesigner(String designer,int bookId)
    {
        userRepository.saveDesigner(designer,bookId);
    }

    public void saveGenre(String genre,String username)
    {
        userRepository.saveGenre(genre,username);

    }

    void incrExp(String username)
    {
        userRepository.incrExp(username);
    }

    public Genre saveThisGenre(String genre)
    {
        return userRepository.saveThisGenre(genre);
    }

    public List<Genre> getGenre(String genre)
    {
        return  userRepository.getGenre(genre);
    }

    List<Type> getType(String type)
    {
        return userRepository.getType(type);

    }
    List<Gender> getGender(String gender)
    {
        return userRepository.getGender(gender);

    }

    List<ageGroup> getAgeGroup(String ageGroup)
    {
        return userRepository.getAgeGroup(ageGroup);

    }
    List<Role> getRole(String role)
    {
        return userRepository.getRole(role);

    }
    List<Type> getNationality(String nationality)
    {
        return userRepository.getType(nationality);

    }

    void createGender(String gender)
    {
        userRepository.createGender(gender);
    }

    void createAgeGroup(String ageGroup)
    {
        userRepository.createAgeGroup(ageGroup);
    }
    void  createNationality(String nationality)
    {
        userRepository.createNationality(nationality);
    }


    void createType(String type)
    {
        userRepository.createType(type);

    }
    void createRole(String role)
    {
        userRepository.createRole(role);
    }

    void createUser(String username,int exp,double cost)
    {
     userRepository.createUser(username,exp,cost);    
	}

    void setAgeGroup(String ageGroup,String username)
    {
        userRepository.setAgeGroup(ageGroup,username);
    }
    void setGender(String gender,String username)
    {
        userRepository.setGender(gender,username);
    }
    void setNationality(String nationality,String username)
    {
        userRepository.setNationality(nationality,username);
    }
    public Collection<Book> getBooksRecommendation(String username)
    {
        Collection<Book> recListOne =userRepository.getRecAccAuth(username);
        Collection<Book> recListTwo =userRepository.getRecAccLikes(username);
        Collection<Book> recListThree=userRepository.getRecAccProfile(username);
        Collection<Book> recListFour=userRepository.bookReccomendation(username);

        recListOne.addAll(recListTwo);
        recListOne.addAll(recListTwo);
        recListOne.addAll(recListThree);


        Set<Book> set = new HashSet<>(recListOne);
        recListOne.clear();
        recListOne.addAll(set);

        return recListOne;

    }

    public void createEditor(String username)
    {
        userRepository.createEditor(username);
    }

    public void createDesigner(String username)
    {
        userRepository.createDesigner(username);
    }

    public  void  saveExpCost(int exp,double cost,String username)
    {
        userRepository.saveExpCost(exp,cost,username);
    }



    public void dop() {
        userRepository.dop();
    }
    public void pop() {
        userRepository.pop();
    }
    public void bob() {
        userRepository.bob();
    }
    public void top() {
        userRepository.top();
    }

}


