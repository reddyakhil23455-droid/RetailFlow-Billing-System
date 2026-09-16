package com.supermarket.billing.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DatabaseTestRepository {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseTestRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String testConnection() {

        Integer result = jdbcTemplate.queryForObject(
                "SELECT 1",
                Integer.class
        );

        return "Database connected successfully. Result = "
                + result;
    }
}