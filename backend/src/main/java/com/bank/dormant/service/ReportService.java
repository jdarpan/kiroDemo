package com.bank.dormant.service;

import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.model.ReclaimStatus;
import com.bank.dormant.repository.DormantAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for generating CSV reports of dormant accounts
 * Requirements: 11.2, 11.3, 11.4
 */
@Service
public class ReportService {
    
    private final DormantAccountRepository repository;
    
    @Autowired
    public ReportService(DormantAccountRepository repository) {
        this.repository = repository;
    }
    
    /**
     * Generate CSV content from a list of accounts
     * Requirements: 11.3, 11.4
     */
    public String generateCSV(List<DormantAccount> accounts) {
        StringBuilder csv = new StringBuilder();
        
        // Add CSV headers for all account fields
        csv.append("Account Number,Bank Name,Balance,Customer Name,Customer Email,")
           .append("Reclaim Status,Reclaim Date,Clawback Date,Comments\n");
        
        // Format each account as a CSV row
        for (DormantAccount account : accounts) {
            csv.append(formatCSVRow(account)).append("\n");
        }
        
        return csv.toString();
    }
    
    /**
     * Apply filters to get accounts for export
     * Requirements: 11.2
     */
    public List<DormantAccount> applyFilters(String searchTerm, String bankName, ReclaimStatus status) {
        List<DormantAccount> accounts = repository.findAll();
        
        // Apply search term filter if provided
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String lowerSearchTerm = searchTerm.toLowerCase();
            accounts = accounts.stream()
                .filter(account -> 
                    (account.getAccountNumber() != null && account.getAccountNumber().toLowerCase().contains(lowerSearchTerm)) ||
                    (account.getBankName() != null && account.getBankName().toLowerCase().contains(lowerSearchTerm)) ||
                    (account.getCustomerName() != null && account.getCustomerName().toLowerCase().contains(lowerSearchTerm)) ||
                    (account.getCustomerEmail() != null && account.getCustomerEmail().toLowerCase().contains(lowerSearchTerm))
                )
                .collect(Collectors.toList());
        }
        
        // Apply bank name filter if provided
        if (bankName != null && !bankName.trim().isEmpty()) {
            accounts = accounts.stream()
                .filter(account -> account.getBankName() != null && 
                                 account.getBankName().equalsIgnoreCase(bankName))
                .collect(Collectors.toList());
        }
        
        // Apply reclaim status filter if provided
        if (status != null) {
            accounts = accounts.stream()
                .filter(account -> status.equals(account.getReclaimStatus()))
                .collect(Collectors.toList());
        }
        
        return accounts;
    }
    
    /**
     * Format a single account as a CSV row
     * Requirements: 11.3
     */
    public String formatCSVRow(DormantAccount account) {
        return String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s",
            escapeCsvValue(account.getAccountNumber()),
            escapeCsvValue(account.getBankName()),
            formatBalance(account.getBalance()),
            escapeCsvValue(account.getCustomerName()),
            escapeCsvValue(account.getCustomerEmail()),
            formatReclaimStatus(account.getReclaimStatus()),
            formatDate(account.getReclaimDate()),
            formatDate(account.getClawbackDate()),
            escapeCsvValue(account.getComments())
        );
    }
    
    /**
     * Escape CSV values to handle commas, quotes, and newlines
     */
    private String escapeCsvValue(String value) {
        if (value == null) {
            return "";
        }
        
        // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
        if (value.contains(",") || value.contains("\"") || value.contains("\n") || value.contains("\r")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        
        return value;
    }
    
    /**
     * Format balance as string
     */
    private String formatBalance(BigDecimal balance) {
        return balance != null ? balance.toString() : "0.00";
    }
    
    /**
     * Format reclaim status as string
     */
    private String formatReclaimStatus(ReclaimStatus status) {
        return status != null ? status.toString() : "";
    }
    
    /**
     * Format date as string
     */
    private String formatDate(LocalDate date) {
        return date != null ? date.toString() : "";
    }
}
