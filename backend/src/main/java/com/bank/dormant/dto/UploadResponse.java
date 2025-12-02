package com.bank.dormant.dto;

public class UploadResponse {
    private int successCount;
    private int failureCount;
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
