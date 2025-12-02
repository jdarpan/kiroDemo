package com.bank.dormant.repository;

import com.bank.dormant.dto.BankSummary;
import com.bank.dormant.model.DormantAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DormantAccountRepository extends JpaRepository<DormantAccount, Long> {
    
    @Query("SELECT a FROM DormantAccount a WHERE " +
           "LOWER(a.accountNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.accountHolderName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<DormantAccount> searchAccounts(@Param("query") String query);
    
    @Query("SELECT new com.bank.dormant.dto.BankSummary(a.bankName, COUNT(a), SUM(a.balance)) " +
           "FROM DormantAccount a GROUP BY a.bankName")
    List<BankSummary> getBankSummaries();
    
    Optional<DormantAccount> findByAccountNumber(String accountNumber);
}
