package com.bank.dormant;

import net.jqwik.api.*;

/**
 * Simple test to verify jqwik property-based testing framework is properly configured.
 */
class JqwikConfigurationTest {

    @Property
    boolean absoluteValueOfAllNumbersIsPositive(@ForAll int anInteger) {
        // Handle Integer.MIN_VALUE edge case where Math.abs returns negative
        if (anInteger == Integer.MIN_VALUE) {
            return true; // Skip this edge case
        }
        return Math.abs(anInteger) >= 0;
    }

    @Property
    boolean lengthOfConcatenatedStringIsSum(@ForAll String string1, @ForAll String string2) {
        String concatenated = string1 + string2;
        return concatenated.length() == string1.length() + string2.length();
    }
}
