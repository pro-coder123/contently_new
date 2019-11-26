package com.stackroute.awsstorage.controller;

import com.stackroute.awsstorage.model.ContentDTO;
import com.stackroute.awsstorage.service.AmazonClient;
import com.stackroute.awsstorage.service.RabbitMQSender;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;


@CrossOrigin
@RestController
@RequestMapping("api/v1")
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    private AmazonClient amazonClient;
    private RabbitMQSender rabbitMQSender;

    @Autowired
    public FileController(AmazonClient amazonClient, RabbitMQSender rabbitMQSender) {
        this.amazonClient = amazonClient;
        this.rabbitMQSender = rabbitMQSender;
    }

    @PostMapping("/file/{filename}")
    public ResponseEntity<?> uploadFile(@RequestPart(value = "file") MultipartFile file, @PathVariable String filename) {

        return new ResponseEntity<String>(this.amazonClient.uploadFile(file, filename), HttpStatus.CREATED);
    }

    @PostMapping("/text/{filename}")
    public ResponseEntity<?> uploadText(@PathVariable("filename") String filename, @RequestPart(value = "file") MultipartFile file) throws IOException {

        System.out.println("Working Directory = " +
                System.getProperty("user.dir"));


        Process p1 = Runtime.getRuntime().exec("ls");

        BufferedReader stdInput1 = new BufferedReader(new
                InputStreamReader(p1.getInputStream()));

        BufferedReader stdError1 = new BufferedReader(new
                InputStreamReader(p1.getErrorStream()));

        System.out.println("Output of lsd:\n");

        String s1 = "";

        while ((s1 = stdInput1.readLine()) != null) {

            System.out.println(s1);

        }


        String s = null;
        File f = amazonClient.convertMultiPartToFile(file);
        String str = FileUtils.readFileToString(f);
//
//        String[] cmd = {
//                "python",
//                "./Plagiarism-Checker/scripts/main.py",
//                str
//        };


//        Process p = Runtime.getRuntime().exec(cmd);
//        BufferedReader stdInput = new BufferedReader(new
//                InputStreamReader(p.getInputStream()));
//
//        BufferedReader stdError = new BufferedReader(new
//                InputStreamReader(p.getErrorStream()));

//        System.out.println("Here is the standard output of the command:\n");
//        String url = "";
//        float percentage = 0;
//        while ((s = stdInput.readLine()) != null) {
//            System.out.println("s:" + s);
//            String[] result = s.split(" ", -1);
//            System.out.println("result");
//            try {
//                url = result[0];
//                percentage = Float.parseFloat(result[1]);
//                System.out.println("percentage:" + percentage);
//            } catch (Exception e) {
//                ContentDTO contentDTO = new ContentDTO();
//                int id = Integer.parseInt(filename);
//                contentDTO.setId(id);
//                contentDTO.setPlagarized(false);
//                contentDTO.setPlagCheckingDone(true);
//                rabbitMQSender.sendContent(contentDTO);
//        this.amazonClient.generatePDFFromHTML(filename, file);
//                return new ResponseEntity<>("Success", HttpStatus.CREATED);
//            }
//
//        }
//
//        System.out.println("URL = " + url);
//        System.out.println("Percentage = " + percentage);
//        if (percentage > 35) {
//            ContentDTO contentDTO = new ContentDTO();
//            int id = Integer.parseInt(filename);
//            contentDTO.setId(id);
//            contentDTO.setPlagarized(true);
//            contentDTO.setPlagCheckingDone(true);
//            rabbitMQSender.sendContent(contentDTO);
//            return new ResponseEntity<>("Plagiarised!\n" + url + "\n" + percentage, HttpStatus.CONFLICT);
//        }

        ContentDTO contentDTO = new ContentDTO();
        int id = Integer.parseInt(filename);
        contentDTO.setId(id);
        contentDTO.setPlagarized(false);
        contentDTO.setPlagCheckingDone(true);
        rabbitMQSender.sendContent(contentDTO);
        this.amazonClient.generatePDFFromHTML(filename, file);
        return new ResponseEntity<>("Success", HttpStatus.CREATED);

    }


    @DeleteMapping("/file")
    public String deleteFile(@RequestPart(value = "url") String fileUrl) {
        return this.amazonClient.deleteFileFromS3Bucket(fileUrl);
    }

    @GetMapping("/file/{filename}")
    public ResponseEntity<InputStreamResource> getFile(@PathVariable String filename) {
        return this.amazonClient.getFile(filename);
    }
}

