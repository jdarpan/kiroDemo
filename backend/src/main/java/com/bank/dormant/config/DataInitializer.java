package com.bank.dormant.config;

import com.bank.dormant.model.DormantAccount;
import com.bank.dormant.repository.DormantAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.Arrays;

@Component
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
        acc1.setAccountHolderName("John Doe");
        acc1.setBankName("Chase Bank");
        acc1.setBalance(5000.00);
        acc1.setLastTransactionDate(LocalDate.now().minusYears(3));
        
        DormantAccount acc2 = new DormantAccount();
        acc2.setAccountNumber("ACC005678");
        acc2.setAccountHolderName("Jane Smith");
        acc2.setBankName("Wells Fargo");
        acc2.setBalance(12000.00);
        acc2.setLastTransactionDate(LocalDate.now().minusYears(5));
        
        DormantAccount acc3 = new DormantAccount();
        acc3.setAccountNumber("ACC009012");
        acc3.setAccountHolderName("Bob Johnson");
        acc3.setBankName("Chase Bank");
        acc3.setBalance(3500.00);
        acc3.setLastTransactionDate(LocalDate.now().minusYears(4));
        
        repository.saveAll(Arrays.asList(acc1, acc2, acc3));
    }
}
