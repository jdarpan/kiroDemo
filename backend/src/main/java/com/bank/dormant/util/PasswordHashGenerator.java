package com.bank.dormant.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String adminPassword = "admin123";
        String operatorPassword = "operator123";
        
        String adminHash = encoder.encode(adminPassword);
        String operatorHash = encoder.encode(operatorPassword);
        
        System.out.println("Admin password hash: " + adminHash);
        System.out.println("Operator password hash: " + operatorHash);
        
        // Verify the hashes work
        System.out.println("\nVerification:");
        System.out.println("Admin matches: " + encoder.matches(adminPassword, adminHash));
        System.out.println("Operator matches: " + encoder.matches(operatorPassword, operatorHash));
    }
}
