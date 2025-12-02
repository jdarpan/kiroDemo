package com.bank.dormant.dto;

import java.util.List;

public class BulkUpdateRequest {
    private List<Long> accountIds;
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
