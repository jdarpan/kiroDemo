package com.bank.dormant.service;

import com.bank.dormant.dto.AccountUpdateRequest;
import com.bank.dormant.dto.BulkUpdateRequest;
import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.repository.DormantAccountRepository;
import com.bank.dormant.validation.InputSanitizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class DormantAccountService {
    
    private final DormantAccountRepository repository;
    private final InputSanitizer inputSanitizer;
    
    @Autowired
    public DormantAccountService(DormantAccountRepository repository, InputSanitizer inputSanitizer) {
        this.repository = repository;
        this.inputSanitizer = inputSanitizer;
    }
    
    /**
     * Get all dormant accounts
     * Requirements: 3.1
     */
    public List<DormantAccount> getAllAccounts() {
        return repository.findAll();
    }
    
    /**
     * Search accounts with case-insensitive filtering
     * Requirements: 4.1, 4.2, 4.4, 10.5
     */
    public List<DormantAccount> searchAccounts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return repository.findAll();
        }
        // Sanitize search term to prevent injection attacks
        String sanitizedQuery = inputSanitizer.sanitizeSearchTerm(query);
        return repository.searchAccounts(sanitizedQuery);
    }
    
    /**
     * Get account by ID
     * Requirements: 3.1
     */
    public DormantAccount getAccountById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }
    
    /**
     * Update single account with date validation
     * Requirements: 5.2, 5.3, 5.4, 5.5, 8.2, 10.2
     */
    @Transactional
    public DormantAccount updateAccount(Long id, AccountUpdateRequest request) {
        DormantAccount account = getAccountById(id);
        
        // Validate date relationships (clawback after reclaim)
        validateDateRelationship(request.getReclaimDate(), request.getClawbackDate());
        
        updateAccountFields(account, request);
        
        // Immediate persistence (handled by @Transactional and save)
        return repository.save(account);
    }
    
    /**
     * Bulk update accounts - apply updates to all selected accounts
     * Returns count of updated accounts
     * Requirements: 6.2, 6.3, 6.4, 6.5
     */
    @Transactional
    public int bulkUpdateAccounts(BulkUpdateRequest request) {
        // Validate date relationships before applying updates
        AccountUpdateRequest updateData = request.getUpdateData();
        validateDateRelationship(updateData.getReclaimDate(), updateData.getClawbackDate());
        
        // Apply updates to all selected accounts
        List<DormantAccount> accounts = repository.findAllById(request.getAccountIds());
        accounts.forEach(account -> updateAccountFields(account, updateData));
        
        // Save all and return count of updated accounts
        List<DormantAccount> updatedAccounts = repository.saveAll(accounts);
        return updatedAccounts.size();
    }
    
    /**
     * Get bank summaries with aggregation logic
     * Requirements: 3.2, 3.3
     */
    public List<com.bank.dormant.dto.BankSummary> getBankSummaries() {
        return repository.getBankSummaries().stream()
            .map(projection -> new com.bank.dormant.dto.BankSummary(
                projection.getBankName(),
                projection.getAccountCount(),
                projection.getTotalBalance()
            ))
            .toList();
    }
    
    /**
     * Validate that clawback date is not before reclaim date
     * Requirements: 10.2
     */
    private void validateDateRelationship(java.time.LocalDate reclaimDate, java.time.LocalDate clawbackDate) {
        if (reclaimDate != null && clawbackDate != null && clawbackDate.isBefore(reclaimDate)) {
            throw new IllegalArgumentException("Clawback date cannot be before reclaim date");
        }
    }
    
    private void updateAccountFields(DormantAccount account, AccountUpdateRequest request) {
        if (request.getReclaimStatus() != null) {
            account.setReclaimStatus(request.getReclaimStatus());
        }
        if (request.getReclaimDate() != null) {
            account.setReclaimDate(request.getReclaimDate());
        }
        if (request.getClawbackDate() != null) {
            account.setClawbackDate(request.getClawbackDate());
        }
        if (request.getComments() != null) {
            // Sanitize comments to prevent XSS and injection attacks
            String sanitizedComments = inputSanitizer.sanitize(request.getComments());
            account.setComments(sanitizedComments);
        }
    }
}
