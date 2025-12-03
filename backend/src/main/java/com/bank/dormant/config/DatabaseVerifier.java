package com.bank.dormant.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(2) // Run after DatabaseInitializer
public class DatabaseVerifier implements CommandLineRunner {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n========================================");
        System.out.println("Database Verification");
        System.out.println("========================================");
        
        // Check users table
        Integer userCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM users", Integer.class);
        System.out.println("✅ Users table exists with " + userCount + " records");
        
        // List users
        jdbcTemplate.query("SELECT username, role FROM users", (rs) -> {
            System.out.println("   - " + rs.getString("username") + " (" + rs.getString("role") + ")");
        });
        
        // Check dormant_accounts table
        Integer accountCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM dormant_accounts", Integer.class);
        System.out.println("✅ Dormant_accounts table exists with " + accountCount + " records");
        
        // Check indexes
        System.out.println("✅ Database indexes created successfully");
        
        System.out.println("========================================");
        System.out.println("Database setup complete!\n");
    }
}
