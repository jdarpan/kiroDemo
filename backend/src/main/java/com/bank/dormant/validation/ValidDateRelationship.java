package com.bank.dormant.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom validation annotation to ensure clawback date is after reclaim date
 * Requirements: 10.2
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DateRelationshipValidator.class)
@Documented
public @interface ValidDateRelationship {
    String message() default "Clawback date must be after reclaim date";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
