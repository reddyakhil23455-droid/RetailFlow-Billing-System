package com.supermarket.billing.repository;

import com.supermarket.billing.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuthRepository {

    private final JdbcTemplate jdbcTemplate;

    public AuthRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public User findByUsername(String username) {

        String sql = """
                SELECT id, username, email, password, role
                FROM supermarket_users
                WHERE username = ?
                """;

        List<User> users = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("role")
                ),
                username
        );

        return users.isEmpty() ? null : users.get(0);
    }

    public int register(User user) {

        String sql = """
                INSERT INTO supermarket_users
                (username, email, password, role)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                "CASHIER"
        );
    }
}