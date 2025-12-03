package com.bank.dormant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

/**
 * DTO for bank summary data
 * Requirements: 9.5, 10.3
 */
public class BankSummary {
    @NotBlank(message = "Bank name is required")
    private String bankName;
    
    @NotNull(message = "Account count is required")
    @PositiveOrZero(message = "Account count must be zero or positive")
    private Long accountCount;
    
    @NotNull(message = "Total balance is required")
    @PositiveOrZero(message = "Total balance must be zero or positive")
    private BigDecimal totalBalance;

    public BankSummary(String bankName, Long accountCount, BigDecimal totalBalance) {
        this.bankName = bankName;
        this.accountCount = accountCount;
        this.totalBalance = totalBalance;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public Long getAccountCount() {
        return accountCount;
    }

    public void setAccountCount(Long accountCount) {
        this.accountCount = accountCount;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }
}
