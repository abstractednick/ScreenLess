# Android app

Native client for ScreenLess. Kotlin, Jetpack Compose, Hilt, Retrofit.

Open this folder in Android Studio (Koala / Ladybug+) and sync Gradle. Studio will generate the Gradle wrapper on first import if `gradlew` is missing.

```text
app/src/main/java/com/screenless/app/
  ScreenLessApp.kt          Hilt application
  MainActivity.kt
  ui/theme                  Forest / cream / clay
  ui/screens                Onboarding → live room → reflection
  ui/preview/Demo.kt        Seed-aligned sample data
  data/remote               Retrofit surface
  data/usage                Privacy boundary (UsageStats → kind)
  domain/model              Windows, presence, streaks
```

Emulator API host: `http://10.0.2.2:4000/v1/`

The live room is designed as a **quiet presence surface**. If you add chat, keep it behind the `group_chat_reactions` flag and do not drown the signal stream.
