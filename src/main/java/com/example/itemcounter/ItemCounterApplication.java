package com.example.itemcounter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ItemCounterApplication {
    public static void main(String[] args) {
        // Start the Spring Boot application
        SpringApplication.run(ItemCounterApplication.class, args);
        
        // Optionally, print a message when the application starts
        System.out.println("Spring Boot application is running...");
    }
}
