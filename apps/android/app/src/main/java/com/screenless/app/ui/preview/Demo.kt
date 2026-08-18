package com.screenless.app.ui.preview

import com.screenless.app.domain.model.Badge
import com.screenless.app.domain.model.Group
import com.screenless.app.domain.model.Participant
import com.screenless.app.domain.model.Presence
import com.screenless.app.domain.model.ScreenlessWindow
import com.screenless.app.domain.model.SoftSignal
import com.screenless.app.domain.model.Streak
import com.screenless.app.domain.model.User
import com.screenless.app.domain.model.WindowContext
import com.screenless.app.domain.model.WindowStatus

object Demo {
    val maya = User("1", "Maya", 28, bio = "Night library, analog notes.")
    val karan = User("2", "Karan", 168, bio = "Walks without a playlist.")
    val jules = User("3", "Jules", 42, bio = "Studio hours.")
    val nico = User("4", "Nico", 210, bio = "Self-care Sundays.")

    val live = ScreenlessWindow(
        id = "live",
        title = "Library lamps",
        context = WindowContext.STUDY,
        status = WindowStatus.LIVE,
        startsAt = "now",
        endsAt = "27m",
        durationMinutes = 45,
        discouragedApps = listOf("instagram", "tiktok", "youtube"),
        groupName = "Night Owls",
        participants = listOf(
            Participant(maya, Presence.FOCUSED, 96, 0),
            Participant(karan, Presence.PEEKED, 81, 1),
            Participant(jules, Presence.FOCUSED, 100, 0),
        ),
    )

    val signals = listOf(
        SoftSignal("a", "Maya settled in", "focus", "17m ago"),
        SoftSignal("b", "Karan peeked at socials", "peek", "4m ago"),
        SoftSignal("c", "Karan is back in the window", "return", "3m ago"),
    )

    val groups = listOf(
        Group("g1", "Night Owls", "Late study windows. Lamps on, phones down.", "OWL42K", listOf(maya, karan, jules)),
        Group("g2", "Sunday Walks", "No earbuds. Notice the street.", "WALK9M", listOf(nico, maya, karan)),
    )

    val streaks = listOf(
        Streak("personal", 12, 19),
        Streak("study", 9, 11),
        Streak("group", 8, 8, "Night Owls"),
    )

    val badges = listOf(
        Badge("first-window", "First pane", "Finished your first screenless window."),
        Badge("week-garden", "Week garden", "Seven days of showing up."),
        Badge("walk-unplugged", "Unplugged walk", "Completed a walk window."),
    )
}
