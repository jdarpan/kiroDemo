package com.bank.dormant.controller;

import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.model.ReclaimStatus;
import com.bank.dormant.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * REST API Controller for Report Export
 * Requirements: 11.2, 11.5, 11.6
 */
@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ReportController {
    
    private final ReportService reportService;
    
    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    
    /**
     * GET /api/reports/export - Generate CSV export with optional filters
     * Requirements: 11.2, 11.5, 11.6
     * 
     * @param search Optional search term to filter accounts
     * @param bankName Optional bank name to filter accounts
     * @param status Optional reclaim status to filter accounts
     * @return CSV file with timestamped filename
     */
    @GetMapping("/export")
    public ResponseEntity<String> exportCSV(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String bankName,
            @RequestParam(required = false) ReclaimStatus status) {
        try {
            // Apply filters to get accounts for export
            List<DormantAccount> accounts = reportService.applyFilters(search, bankName, status);
            
            // Generate CSV content
            String csvContent = reportService.generateCSV(accounts);
            
            // Create timestamped filename
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "dormant_accounts_" + timestamp + ".csv";
            
            // Set appropriate content-type headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("no-cache, no-store, must-revalidate");
            headers.setPragma("no-cache");
            headers.setExpires(0);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
                
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
