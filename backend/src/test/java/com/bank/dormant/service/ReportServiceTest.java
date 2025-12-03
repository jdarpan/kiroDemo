package com.bank.dormant.service;

import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.model.ReclaimStatus;
import com.bank.dormant.repository.DormantAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {
    
    @Mock
    private DormantAccountRepository repository;
    
    @InjectMocks
    private ReportService reportService;
    
    private DormantAccount testAccount1;
    private DormantAccount testAccount2;
    
    @BeforeEach
    void setUp() {
        testAccount1 = new DormantAccount(
            1L,
            "ACC001",
            "Bank A",
            new BigDecimal("1000.00"),
            "John Doe",
            "john@example.com",
            ReclaimStatus.PENDING,
            LocalDate.of(2024, 1, 1),
            LocalDate.of(2024, 2, 1),
            "Test comment",
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        
        testAccount2 = new DormantAccount(
            2L,
            "ACC002",
            "Bank B",
            new BigDecimal("2000.00"),
            "Jane Smith",
            "jane@example.com",
            ReclaimStatus.COMPLETED,
            LocalDate.of(2024, 3, 1),
            LocalDate.of(2024, 4, 1),
            null,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }
    
    @Test
    void testGenerateCSV_WithAccounts() {
        // Arrange
        List<DormantAccount> accounts = Arrays.asList(testAccount1, testAccount2);
        
        // Act
        String csv = reportService.generateCSV(accounts);
        
        // Assert
        assertNotNull(csv);
        assertTrue(csv.contains("Account Number,Bank Name,Balance"));
        assertTrue(csv.contains("ACC001"));
        assertTrue(csv.contains("ACC002"));
        assertTrue(csv.contains("Bank A"));
        assertTrue(csv.contains("Bank B"));
        assertTrue(csv.contains("1000.00"));
        assertTrue(csv.contains("2000.00"));
    }
    
    @Test
    void testGenerateCSV_WithEmptyList() {
        // Arrange
        List<DormantAccount> accounts = Arrays.asList();
        
        // Act
        String csv = reportService.generateCSV(accounts);
        
        // Assert
        assertNotNull(csv);
        assertTrue(csv.contains("Account Number,Bank Name,Balance"));
        // Should only contain header
        assertEquals(1, csv.split("\n").length);
    }
    
    @Test
    void testFormatCSVRow_WithAllFields() {
        // Act
        String row = reportService.formatCSVRow(testAccount1);
        
        // Assert
        assertNotNull(row);
        assertTrue(row.contains("ACC001"));
        assertTrue(row.contains("Bank A"));
        assertTrue(row.contains("1000.00"));
        assertTrue(row.contains("John Doe"));
        assertTrue(row.contains("john@example.com"));
        assertTrue(row.contains("PENDING"));
        assertTrue(row.contains("2024-01-01"));
        assertTrue(row.contains("2024-02-01"));
    }
    
    @Test
    void testFormatCSVRow_WithNullFields() {
        // Act
        String row = reportService.formatCSVRow(testAccount2);
        
        // Assert
        assertNotNull(row);
        assertTrue(row.contains("ACC002"));
        assertTrue(row.contains("Bank B"));
        // Should handle null comment gracefully
        assertFalse(row.contains("null"));
    }
    
    @Test
    void testApplyFilters_NoFilters() {
        // Arrange
        List<DormantAccount> accounts = Arrays.asList(testAccount1, testAccount2);
        when(repository.findAll()).thenReturn(accounts);
        
        // Act
        List<DormantAccount> result = reportService.applyFilters(null, null, null);
        
        // Assert
        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }
    
    @Test
    void testApplyFilters_WithSearchTerm() {
        // Arrange
        List<DormantAccount> accounts = Arrays.asList(testAccount1, testAccount2);
        when(repository.findAll()).thenReturn(accounts);
        
        // Act
        List<DormantAccount> result = reportService.applyFilters("ACC001", null, null);
        
        // Assert
        assertEquals(1, result.size());
        assertEquals("ACC001", result.get(0).getAccountNumber());
    }
    
    @Test
    void testApplyFilters_WithBankName() {
        // Arrange
        List<DormantAccount> accounts = Arrays.asList(testAccount1, testAccount2);
        when(repository.findAll()).thenReturn(accounts);
        
        // Act
        List<DormantAccount> result = reportService.applyFilters(null, "Bank A", null);
        
        // Assert
        assertEquals(1, result.size());
        assertEquals("Bank A", result.get(0).getBankName());
    }
    
    @Test
    void testApplyFilters_WithStatus() {
        // Arrange
        List<DormantAccount> accounts = Arrays.asList(testAccount1, testAccount2);
        when(repository.findAll()).thenReturn(accounts);
        
        // Act
        List<DormantAccount> result = reportService.applyFilters(null, null, ReclaimStatus.PENDING);
        
        // Assert
        assertEquals(1, result.size());
        assertEquals(ReclaimStatus.PENDING, result.get(0).getReclaimStatus());
    }
    
    @Test
    void testApplyFilters_WithMultipleFilters() {
        // Arrange
        List<DormantAccount> accounts = Arrays.asList(testAccount1, testAccount2);
        when(repository.findAll()).thenReturn(accounts);
        
        // Act
        List<DormantAccount> result = reportService.applyFilters("Bank A", "Bank A", ReclaimStatus.PENDING);
        
        // Assert
        assertEquals(1, result.size());
        assertEquals("ACC001", result.get(0).getAccountNumber());
    }
}
