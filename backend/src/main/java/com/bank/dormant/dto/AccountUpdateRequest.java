package com.bank.dormant.dto;

import com.bank.dormant.model.ReclaimStatus;
import com.bank.dormant.validation.ValidDateRelationship;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * DTO for account update requests
 * Requirements: 9.5, 10.1, 10.2, 10.3
 */
@ValidDateRelationship
public class AccountUpdateRequest {
    private ReclaimStatus reclaimStatus;
    
    @PastOrPresent(message = "Reclaim date cannot be in the future")
    private LocalDate reclaimDate;
    
    @PastOrPresent(message = "Clawback date cannot be in the future")
    private LocalDate clawbackDate;
    
    @Size(max = 1000, message = "Comments cannot exceed 1000 characters")
    private String comments;

    public ReclaimStatus getReclaimStatus() {
        return reclaimStatus;
    }

    public void setReclaimStatus(ReclaimStatus reclaimStatus) {
        this.reclaimStatus = reclaimStatus;
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
