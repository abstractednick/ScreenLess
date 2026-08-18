package com.screenless.app.data.usage

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Consent-gated usage observer.
 *
 * We never ship raw package timelines to the API. This class collapses
 * UsageStats into a single friendly kind: peek / focus / drop. The live
 * room shows "Karan peeked at socials" — not "Instagram 00:01:14".
 */
@Singleton
class UsageSignalMapper @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    private val social = setOf(
        "com.instagram.android",
        "com.zhiliaoapp.musically",
        "com.twitter.android",
        "com.reddit.frontpage",
        "com.snapchat.android",
    )

    fun summarize(discouraged: Set<String>, windowStartMs: Long): Kind {
        val manager = context.getSystemService(UsageStatsManager::class.java) ?: return Kind.Focus
        val end = System.currentTimeMillis()
        val events = manager.queryEvents(windowStartMs, end)
        val event = UsageEvents.Event()
        var lastPeek = 0L
        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (event.eventType != UsageEvents.Event.ACTIVITY_RESUMED) continue
            val pkg = event.packageName
            if (pkg in social || pkg.substringAfterLast('.').lowercase() in discouraged) {
                lastPeek = event.timeStamp
            }
        }
        if (lastPeek == 0L) return Kind.Focus
        val age = end - lastPeek
        return if (age < 20_000) Kind.Peek else Kind.Focus
    }

    enum class Kind { Focus, Peek, Drop }
}
