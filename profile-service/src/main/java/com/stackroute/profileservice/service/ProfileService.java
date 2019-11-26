package com.stackroute.profileservice.service;

import com.stackroute.profileservice.model.Chapter;
import com.stackroute.profileservice.model.Profile;
import java.text.ParseException;
import java.util.List;

public interface ProfileService {

    public Profile saveProfile(Profile profile);
    public List<Profile> getallProfile();
    public Profile update(Profile profile);
    public boolean deleteProfile(int id);
    public double getByname(String name);
    public Chapter getCurrentChapter(String username,int bookId) throws ParseException;
    public Chapter updateReleaseNext(String username,int bookId);
    public List<Profile> getByRole(String role);
}
