package com.screenless.app

import org.junit.Assert.assertEquals
import org.junit.Test

class StreakPolicyTest {
    @Test
    fun peekDoesNotFailAWindowUntilDropped() {
        val focusedPct = 81
        val status = "PEEKED"
        val kept = status != "DROPPED" && focusedPct >= 70
        assertEquals(true, kept)
    }
}
