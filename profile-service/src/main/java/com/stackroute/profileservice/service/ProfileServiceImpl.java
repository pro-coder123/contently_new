package com.stackroute.profileservice.service;

import com.stackroute.profileservice.model.Chapter;
import com.stackroute.profileservice.model.Profile;
import com.stackroute.profileservice.repository.ProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


@Service
@Primary
@Slf4j
public class ProfileServiceImpl implements ProfileService {
    private ProfileRepository profileRepository;

    @Autowired
    public ProfileServiceImpl(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Override
    public Profile saveProfile(Profile profile) {
        return this.profileRepository.save(profile);
    }

    @Override
    public List<Profile> getallProfile() {
        return this.profileRepository.findAll();
    }

    @Override
    public Profile update(Profile profile) {
        Profile profile1 = profileRepository.findByName(profile.getUsername());
        profile1.setCost(profile.getCost());
        profile1.setExperience(profile.getExperience());
        profile1.setInterest(profile.getInterest());
        profile1.setRatings(profile.getRatings());
        return profileRepository.save(profile1);
    }

    @Override
    public boolean deleteProfile(int id) {
        this.profileRepository.deleteById(id);
        return true;
    }

    @Override
    public double getByname(String name) {
        Profile profile = profileRepository.findByName(name);
        return profile.getCost();
    }

    @Override
    public Chapter getCurrentChapter(String username, int bookId) throws ParseException {
        Profile profile = profileRepository.findByName(username);
        List<Chapter> chapters = profile.getChapterRelease();
        int i = 0;
        for (Chapter chapter : chapters) {
            if (bookId == chapter.getBookId()) {
                if (chapter.isReleaseNext()) {
                    Date date = Calendar.getInstance().getTime();
                    DateFormat dateFormat = new SimpleDateFormat("mm-dd-yyyy hh:mm:ss");
                    String strDate = dateFormat.format(date);
                    date = dateFormat.parse(strDate);

                    Date date1 = chapter.getDate();
                    DateFormat dateFormat1 = new SimpleDateFormat("mm-dd-yyyy hh:mm:ss");
                    String endDate = dateFormat1.format(date1);
                    date1 = dateFormat1.parse(endDate);
                    long diff = date.getTime() - date1.getTime();
                    long diffDays = diff / (24 * 60 * 60 * 1000);
                    log.info(String.valueOf(diffDays));
                    long diffMinutes = diff / (60 * 1000) % 60;
                    log.info(String.valueOf(diffMinutes));
                    long diffSeconds = diff / 1000 % 60;
                    if (diffSeconds >= 30) {
                        chapters.get(i).setChapterIndex(chapter.getChapterIndex() + 1);
                        chapters.get(i).setReleaseNext(false);
                        chapters.get(i).setDate(null);
                        profile.setChapterRelease(chapters);
                        profileRepository.save(profile);
                        return chapters.get(i);
                    } else {
                        return chapter;
                    }
                } else {
                    return chapter;
                }
            }
            i++;
        }
        Chapter chapter = new Chapter();
        chapter.setBookId(bookId);
        chapter.setChapterIndex(0);
        chapters.add(chapter);
        profile.setChapterRelease(chapters);
        profileRepository.save(profile);
        return chapter;
    }

    @Override
    public Chapter updateReleaseNext(String username, int bookId) {
        Profile profile = profileRepository.findByName(username);
        List<Chapter> chapters = profile.getChapterRelease();
        int i = 0;
        for (Chapter chapter : chapters) {
            if (bookId == chapter.getBookId()) {
                chapters.get(i).setReleaseNext(true);
                Date date = Calendar.getInstance().getTime();
                chapters.get(i).setDate(date);
                profile.setChapterRelease(chapters);
                profileRepository.save(profile);
                return chapters.get(i);
            }
            i++;
        }
        return null;
    }

    @Override
    public List<Profile> getByRole(String role) {
        return  profileRepository.findByRole(role);
    }
}
