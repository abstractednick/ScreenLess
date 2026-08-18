package com.screenless.app.domain.model

data class User(
    val id: String,
    val displayName: String,
    val avatarHue: Int,
    val email: String? = null,
    val bio: String? = null,
)

data class Group(
    val id: String,
    val name: String,
    val description: String?,
    val inviteCode: String,
    val members: List<User> = emptyList(),
)

enum class WindowContext { STUDY, SOCIAL, SELF_CARE, DEEP_WORK, WALK }
enum class WindowStatus { SCHEDULED, LIVE, ENDED, CANCELLED }
enum class Presence { FOCUSED, PEEKED, DROPPED, JOINED }

data class Participant(
    val user: User,
    val status: Presence,
    val focusedPct: Int,
    val peekCount: Int,
)

data class ScreenlessWindow(
    val id: String,
    val title: String,
    val context: WindowContext,
    val status: WindowStatus,
    val startsAt: String,
    val endsAt: String,
    val durationMinutes: Int,
    val discouragedApps: List<String>,
    val groupName: String,
    val participants: List<Participant>,
)

data class SoftSignal(
    val id: String,
    val message: String,
    val kind: String,
    val createdAt: String,
)

data class Streak(
    val context: String,
    val current: Int,
    val longest: Int,
    val groupName: String? = null,
)

data class Badge(
    val slug: String,
    val name: String,
    val description: String,
)

data class Reflection(
    val prompt: String,
    val answer: String,
    val windowTitle: String,
)
