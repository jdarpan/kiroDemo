package com.bank.dormant.config;

import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.repository.DormantAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;

// Temporarily disabled - using SQL scripts for initialization
// @Component
public class DataInitializer implements CommandLineRunner {
    
    private final DormantAccountRepository repository;
    
    @Autowired
    public DataInitializer(DormantAccountRepository repository) {
        this.repository = repository;
    }
    
    @Override
    public void run(String... args) {
        DormantAccount acc1 = new DormantAccount();
        acc1.setAccountNumber("ACC001234");
        acc1.setCustomerName("John Doe");
        acc1.setBankName("Chase Bank");
        acc1.setBalance(new BigDecimal("5000.00"));
        
        DormantAccount acc2 = new DormantAccount();
        acc2.setAccountNumber("ACC005678");
        acc2.setCustomerName("Jane Smith");
        acc2.setBankName("Wells Fargo");
        acc2.setBalance(new BigDecimal("12000.00"));
        
        DormantAccount acc3 = new DormantAccount();
        acc3.setAccountNumber("ACC009012");
        acc3.setCustomerName("Bob Johnson");
        acc3.setBankName("Chase Bank");
        acc3.setBalance(new BigDecimal("3500.00"));
        
        repository.saveAll(Arrays.asList(acc1, acc2, acc3));
    }
}
