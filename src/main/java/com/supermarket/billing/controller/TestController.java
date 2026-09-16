package com.supermarket.billing.controller;

import com.supermarket.billing.repository.DatabaseTestRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final DatabaseTestRepository repository;

    public TestController(
            DatabaseTestRepository repository) {

        this.repository = repository;
    }

    @GetMapping("/api/test")
    public String testDatabase() {

        return repository.testConnection();
    }
}