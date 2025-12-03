package com.bank.dormant.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO for file upload response
 * Requirements: 9.5, 10.3
 */
public class UploadResponse {
    @NotNull(message = "Success count is required")
    @PositiveOrZero(message = "Success count must be zero or positive")
    private Integer successCount;
    
    @NotNull(message = "Failure count is required")
    @PositiveOrZero(message = "Failure count must be zero or positive")
    private Integer failureCount;
    
    @NotNull(message = "Message is required")
    private String message;

    public UploadResponse(int successCount, int failureCount, String message) {
        this.successCount = successCount;
        this.failureCount = failureCount;
        this.message = message;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public int getFailureCount() {
        return failureCount;
    }

    public void setFailureCount(int failureCount) {
        this.failureCount = failureCount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
