package com.bank.dormant.service;

import com.bank.dormant.dto.UploadResponse;
import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.repository.DormantAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class FileUploadService {
    
    private final DormantAccountRepository repository;
    
    @Autowired
    public FileUploadService(DormantAccountRepository repository) {
        this.repository = repository;
    }
    
    public UploadResponse processFile(MultipartFile file) {
        int successCount = 0;
        int failureCount = 0;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                
                try {
                    DormantAccount account = parseLine(line);
                    
                    Optional<DormantAccount> existing = repository.findByAccountNumber(account.getAccountNumber());
                    if (existing.isPresent()) {
                        failureCount++;
                        continue;
                    }
                    
                    repository.save(account);
                    successCount++;
                } catch (Exception e) {
                    failureCount++;
                }
            }
        } catch (Exception e) {
            return new UploadResponse(successCount, failureCount, "Error processing file: " + e.getMessage());
        }
        
        return new UploadResponse(successCount, failureCount, 
            "Upload completed: " + successCount + " accounts added, " + failureCount + " failed");
    }
    
    private DormantAccount parseLine(String line) {
        String[] parts = line.split("\\|");
        
        DormantAccount account = new DormantAccount();
        account.setAccountNumber(parts[0].trim());
        account.setCustomerName(parts[1].trim());
        account.setBankName(parts[2].trim());
        account.setBalance(new java.math.BigDecimal(parts[3].trim()));
        
        if (parts.length > 4 && !parts[4].trim().isEmpty()) {
            account.setCustomerEmail(parts[4].trim());
        }
        
        return account;
    }
}
