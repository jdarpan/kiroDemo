package com.bank.dormant.repository;

import com.bank.dormant.model.DormantAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DormantAccountRepository extends JpaRepository<DormantAccount, Long> {
    
    /**
     * Find all dormant accounts by bank name
     * Requirements: 3.2, 3.3
     */
    List<DormantAccount> findByBankName(String bankName);
    
    /**
     * Find account by account number
     */
    Optional<DormantAccount> findByAccountNumber(String accountNumber);
    
    /**
     * Search accounts by account number, bank name, or customer information (case-insensitive)
     * Requirements: 4.1, 4.2
     */
    @Query("SELECT da FROM DormantAccount da WHERE " +
           "LOWER(da.accountNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(da.bankName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(da.customerName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(da.customerEmail) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<DormantAccount> searchAccounts(@Param("searchTerm") String searchTerm);
    
    /**
     * Get bank summaries with account count and total balance aggregation
     * Requirements: 3.2, 3.3
     */
    @Query("SELECT da.bankName as bankName, COUNT(da) as accountCount, SUM(da.balance) as totalBalance " +
           "FROM DormantAccount da " +
           "GROUP BY da.bankName " +
           "ORDER BY da.bankName")
    List<BankSummaryProjection> getBankSummaries();
    
    /**
     * Projection interface for bank summary aggregation
     */
    interface BankSummaryProjection {
        String getBankName();
        Long getAccountCount();
        java.math.BigDecimal getTotalBalance();
    }
}
