package com.bank.dormant.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dormant_accounts")
@EntityListeners(AuditingEntityListener.class)
public class DormantAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @Column(nullable = false)
    @NotBlank(message = "Bank name is required")
    private String bankName;
    
    @Column(nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Balance is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Balance must be non-negative")
    private BigDecimal balance;
    
    @Column
    private String customerName;
    
    @Column
    @Email(message = "Customer email must be a valid email address")
    private String customerEmail;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ReclaimStatus reclaimStatus;
    
    @Column
    private LocalDate reclaimDate;
    
    @Column
    private LocalDate clawbackDate;
    
    @Column(length = 1000)
    private String comments;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructors
    public DormantAccount() {
    }
    
    public DormantAccount(Long id, String accountNumber, String bankName, BigDecimal balance,
                         String customerName, String customerEmail, ReclaimStatus reclaimStatus,
                         LocalDate reclaimDate, LocalDate clawbackDate, String comments,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.bankName = bankName;
        this.balance = balance;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.reclaimStatus = reclaimStatus;
        this.reclaimDate = reclaimDate;
        this.clawbackDate = clawbackDate;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }
    
    public String getBankName() {
        return bankName;
    }
    
    public void setBankName(String bankName) {
        this.bankName = bankName;
    }
    
    public BigDecimal getBalance() {
        return balance;
    }
    
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public ReclaimStatus getReclaimStatus() {
        return reclaimStatus;
    }
    
    public void setReclaimStatus(ReclaimStatus reclaimStatus) {
        this.reclaimStatus = reclaimStatus;
    }
    
    public LocalDate getReclaimDate() {
        return reclaimDate;
    }
    
    public void setReclaimDate(LocalDate reclaimDate) {
        this.reclaimDate = reclaimDate;
    }
    
    public LocalDate getClawbackDate() {
        return clawbackDate;
    }
    
    public void setClawbackDate(LocalDate clawbackDate) {
        this.clawbackDate = clawbackDate;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
