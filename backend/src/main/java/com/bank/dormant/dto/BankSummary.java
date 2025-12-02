package com.bank.dormant.dto;

public class BankSummary {
    private String bankName;
    private Long accountCount;
    private Double totalBalance;

    public BankSummary(String bankName, Long accountCount, Double totalBalance) {
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

    public Double getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(Double totalBalance) {
        this.totalBalance = totalBalance;
    }
}
