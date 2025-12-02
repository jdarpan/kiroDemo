package com.bank.dormant.service;

import com.bank.dormant.dto.AccountUpdateRequest;
import com.bank.dormant.dto.BulkUpdateRequest;
import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.repository.DormantAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class DormantAccountService {
    
    private final DormantAccountRepository repository;
    
    @Autowired
    public DormantAccountService(DormantAccountRepository repository) {
        this.repository = repository;
    }
    
    public List<DormantAccount> searchAccounts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return repository.findAll();
        }
        return repository.searchAccounts(query);
    }
    
    public DormantAccount getAccountById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
    }
    
    @Transactional
    public DormantAccount updateAccount(Long id, AccountUpdateRequest request) {
        DormantAccount account = getAccountById(id);
        updateAccountFields(account, request);
        return repository.save(account);
    }
    
    @Transactional
    public List<DormantAccount> bulkUpdateAccounts(BulkUpdateRequest request) {
        List<DormantAccount> accounts = repository.findAllById(request.getAccountIds());
        accounts.forEach(account -> updateAccountFields(account, request.getUpdateData()));
        return repository.saveAll(accounts);
    }
    
    public List<com.bank.dormant.dto.BankSummary> getBankSummaries() {
        return repository.getBankSummaries();
    }
    
    private void updateAccountFields(DormantAccount account, AccountUpdateRequest request) {
        if (request.getReclaimFlag() != null) {
            account.setReclaimFlag(request.getReclaimFlag());
        }
        if (request.getReclaimDate() != null) {
            account.setReclaimDate(request.getReclaimDate());
        }
        if (request.getClawbackDate() != null) {
            account.setClawbackDate(request.getClawbackDate());
        }
        if (request.getComments() != null) {
            account.setComments(request.getComments());
        }
    }
}
