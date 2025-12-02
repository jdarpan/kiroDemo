package com.bank.dormant.controller;

import com.bank.dormant.dto.AccountUpdateRequest;
import com.bank.dormant.dto.BankSummary;
import com.bank.dormant.dto.BulkUpdateRequest;
import com.bank.dormant.dto.UploadResponse;
import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.service.DormantAccountService;
import com.bank.dormant.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

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
    
    @GetMapping("/dashboard")
    public ResponseEntity<List<BankSummary>> getDashboard() {
        return ResponseEntity.ok(service.getBankSummaries());
    }
    
    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(fileUploadService.processFile(file));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<DormantAccount>> searchAccounts(
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(service.searchAccounts(query));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DormantAccount> getAccount(@PathVariable Long id) {
        return ResponseEntity.ok(service.getAccountById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DormantAccount> updateAccount(
            @PathVariable Long id,
            @RequestBody AccountUpdateRequest request) {
        return ResponseEntity.ok(service.updateAccount(id, request));
    }
    
    @PutMapping("/bulk")
    public ResponseEntity<List<DormantAccount>> bulkUpdateAccounts(
            @RequestBody BulkUpdateRequest request) {
        return ResponseEntity.ok(service.bulkUpdateAccounts(request));
    }
}
