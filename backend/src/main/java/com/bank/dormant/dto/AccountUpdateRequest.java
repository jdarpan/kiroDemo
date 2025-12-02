package com.bank.dormant.dto;

import java.time.LocalDate;

public class AccountUpdateRequest {
    private Boolean reclaimFlag;
    private LocalDate reclaimDate;
    private LocalDate clawbackDate;
    private String comments;

    public Boolean getReclaimFlag() {
        return reclaimFlag;
    }

    public void setReclaimFlag(Boolean reclaimFlag) {
        this.reclaimFlag = reclaimFlag;
    }

    public LocalDate getReclaimDate() {
        return reclaimDate;
    }

    public void setReclaimDate(LocalDate reclaimDate) {
        this.reclaimDate = reclaimDate;
    }

    public LocalDate getClawbackDate() {
        return clawbackDate;
    }

    public void setClawbackDate(LocalDate clawbackDate) {
        this.clawbackDate = clawbackDate;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
