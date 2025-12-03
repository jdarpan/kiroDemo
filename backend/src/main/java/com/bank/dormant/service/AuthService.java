package com.bank.dormant.service;

import com.bank.dormant.dto.LoginRequest;
import com.bank.dormant.dto.LoginResponse;
import com.bank.dormant.model.User;
import com.bank.dormant.repository.UserRepository;
import com.bank.dormant.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    
    @Value("${jwt.expiration}")
    private Long jwtExpiration;
    
    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    
    /**
     * Authenticate user with username and password
     * Returns JWT token if authentication is successful
     */
    public LoginResponse authenticate(LoginRequest loginRequest) {
        // Find user by username
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
        
        // Check if user is active
        if (!user.getActive()) {
            throw new BadCredentialsException("User account is inactive");
        }
        
        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user);
        
        // Return login response
        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole().name(),
                jwtExpiration
        );
    }
    
    /**
     * Hash password using BCrypt
     */
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
}
