package com.bank.dormant.validation;

import org.springframework.stereotype.Component;

/**
 * Utility class for sanitizing user input to prevent injection attacks
 * Requirements: 10.5
 */
@Component
public class InputSanitizer {

    /**
     * Sanitizes string input by removing potentially dangerous characters
     * and escaping HTML/SQL special characters
     * 
     * @param input the raw input string
     * @return sanitized string safe for storage and display
     */
    public String sanitize(String input) {
        if (input == null) {
            return null;
        }

        // Remove null bytes
        String sanitized = input.replace("\0", "");

        // Escape HTML special characters to prevent XSS
        sanitized = sanitized
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");

        // Remove control characters except newlines and tabs
        sanitized = sanitized.replaceAll("[\\p{Cntrl}&&[^\n\t\r]]", "");

        return sanitized.trim();
    }

    /**
     * Sanitizes search terms by removing SQL wildcards and special characters
     * while preserving alphanumeric and common punctuation
     * 
     * @param searchTerm the raw search term
     * @return sanitized search term
     */
    public String sanitizeSearchTerm(String searchTerm) {
        if (searchTerm == null) {
            return null;
        }

        // Remove SQL wildcards and special characters
        String sanitized = searchTerm
            .replace("%", "")
            .replace("_", "")
            .replace("\\", "");

        // Apply general sanitization
        return sanitize(sanitized);
    }

    /**
     * Validates and sanitizes account numbers
     * 
     * @param accountNumber the raw account number
     * @return sanitized account number
     */
    public String sanitizeAccountNumber(String accountNumber) {
        if (accountNumber == null) {
            return null;
        }

        // Remove all non-alphanumeric characters except hyphens
        return accountNumber.replaceAll("[^a-zA-Z0-9-]", "").trim();
    }

    /**
     * Validates and sanitizes email addresses
     * 
     * @param email the raw email
     * @return sanitized email
     */
    public String sanitizeEmail(String email) {
        if (email == null) {
            return null;
        }

        // Remove dangerous characters but keep valid email characters
        return email.replaceAll("[^a-zA-Z0-9@.\\-_+]", "").trim();
    }
}
