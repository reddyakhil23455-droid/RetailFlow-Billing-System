package com.supermarket.billing.service;

import com.supermarket.billing.model.User;
import com.supermarket.billing.repository.AuthRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthRepository authRepository;

    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public User login(String username, String password) {

        User user = authRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("Invalid username or password");
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    public void register(User user) {

        User existingUser = authRepository.findByUsername(user.getUsername());

        if (existingUser != null) {
            throw new RuntimeException("Username already exists");
        }

        authRepository.register(user);
    }
}