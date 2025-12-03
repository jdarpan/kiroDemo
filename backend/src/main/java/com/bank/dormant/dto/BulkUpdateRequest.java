package com.bank.dormant.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * DTO for bulk account update requests
 * Requirements: 9.5, 10.3
 */
public class BulkUpdateRequest {
    @NotEmpty(message = "Account IDs list cannot be empty")
    private List<Long> accountIds;
    
    @NotNull(message = "Update data is required")
    @Valid
    private AccountUpdateRequest updateData;

    public List<Long> getAccountIds() {
        return accountIds;
    }

    public void setAccountIds(List<Long> accountIds) {
        this.accountIds = accountIds;
    }

    public AccountUpdateRequest getUpdateData() {
        return updateData;
    }

    public void setUpdateData(AccountUpdateRequest updateData) {
        this.updateData = updateData;
    }
}
