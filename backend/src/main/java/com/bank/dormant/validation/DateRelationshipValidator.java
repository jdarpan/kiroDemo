package com.bank.dormant.validation;

import com.bank.dormant.dto.AccountUpdateRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;

/**
 * Validator to check that clawback date is after reclaim date
 * Requirements: 10.2
 */
public class DateRelationshipValidator implements ConstraintValidator<ValidDateRelationship, AccountUpdateRequest> {

    @Override
    public void initialize(ValidDateRelationship constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(AccountUpdateRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true; // Null objects are valid (use @NotNull for null checks)
        }

        LocalDate reclaimDate = request.getReclaimDate();
        LocalDate clawbackDate = request.getClawbackDate();

        // If either date is null, skip validation (use @NotNull if required)
        if (reclaimDate == null || clawbackDate == null) {
            return true;
        }

        // Clawback date must be after or equal to reclaim date
        return !clawbackDate.isBefore(reclaimDate);
    }
}
