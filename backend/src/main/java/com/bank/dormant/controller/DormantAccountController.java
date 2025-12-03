package com.bank.dormant.controller;

import com.bank.dormant.dto.AccountUpdateRequest;
import com.bank.dormant.dto.BankSummary;
import com.bank.dormant.dto.BulkUpdateRequest;
import com.bank.dormant.dto.UploadResponse;
import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.service.DormantAccountService;
import com.bank.dormant.service.FileUploadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * REST API Controller for Dormant Account Management
 * Requirements: 9.1, 9.3, 9.4
 */
@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class DormantAccountController {
    
    private final DormantAccountService service;
    private final FileUploadService fileUploadService;
    
    @Autowired
    public DormantAccountController(DormantAccountService service, FileUploadService fileUploadService) {
        this.service = service;
        this.fileUploadService = fileUploadService;
    }
    
    /**
     * GET /api/accounts - Get all accounts with optional search parameter
     * Requirements: 9.1, 9.3
     */
    @GetMapping
    public ResponseEntity<List<DormantAccount>> getAccounts(
            @RequestParam(required = false) String search) {
        try {
            List<DormantAccount> accounts = service.searchAccounts(search);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/accounts/{id} - Get single account by ID
     * Requirements: 9.1, 9.3, 9.4
     */
    @GetMapping("/{id}")
    public ResponseEntity<DormantAccount> getAccount(@PathVariable Long id) {
        try {
            DormantAccount account = service.getAccountById(id);
            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * GET /api/accounts/summary - Get bank summaries with aggregated data
     * Requirements: 9.1, 9.3
     */
    @GetMapping("/summary")
    public ResponseEntity<List<BankSummary>> getSummary() {
        try {
            List<BankSummary> summaries = service.getBankSummaries();
            return ResponseEntity.ok(summaries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * PUT /api/accounts/{id} - Update single account
     * Requirements: 9.1, 9.3, 9.4
     */
    @PutMapping("/{id}")
    public ResponseEntity<DormantAccount> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody AccountUpdateRequest request) {
        try {
            DormantAccount updatedAccount = service.updateAccount(id, request);
            return ResponseEntity.ok(updatedAccount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * PUT /api/accounts/bulk - Bulk update multiple accounts
     * Requirements: 9.1, 9.3, 9.4
     */
    @PutMapping("/bulk")
    public ResponseEntity<Integer> bulkUpdateAccounts(
            @Valid @RequestBody BulkUpdateRequest request) {
        try {
            int updatedCount = service.bulkUpdateAccounts(request);
            return ResponseEntity.ok(updatedCount);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * POST /api/accounts/upload - Upload transaction file (Admin only)
     * Requirements: 9.1, 9.3, 9.4
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            UploadResponse response = fileUploadService.processFile(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
