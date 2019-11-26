package com.stackroute.recommendation.domain;

import org.springframework.stereotype.Component;

@Component
public class PriceRec {
    String genre;
    int editorPay;
    int illustratorPay;
    int base;
    int noOfWords;

    public PriceRec(String genre, int editorPay, int illustratorPay, int base,int noOfWords) {
        this.genre = genre;
        this.editorPay = editorPay;
        this.illustratorPay = illustratorPay;
        this.base = base;
        this.noOfWords=noOfWords;
    }

    public void setNoOfWords(int noOfWords) {
        this.noOfWords = noOfWords;
    }

    public int getNoOfWords() {
        return noOfWords;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getGenre() {
        return genre;
    }

    public int getEditorPay() {
        return editorPay;
    }

    public int getIllustratorPay() {
        return illustratorPay;
    }

    public int getBase() {
        return base;
    }

    public void setEditorPay(int editorPay) {
        this.editorPay = editorPay;
    }

    public void setIllustratorPay(int illustratorPay) {
        this.illustratorPay = illustratorPay;
    }

    public void setBase(int base) {
        this.base = base;
    }

    public PriceRec() {
    }
}
