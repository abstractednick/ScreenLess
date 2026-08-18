package com.screenless.app.ui

import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.screenless.app.ui.screens.CreateWindowScreen
import com.screenless.app.ui.screens.GroupsScreen
import com.screenless.app.ui.screens.HomeScreen
import com.screenless.app.ui.screens.LiveRoomScreen
import com.screenless.app.ui.screens.OnboardingScreen
import com.screenless.app.ui.screens.ReflectionScreen
import com.screenless.app.ui.screens.SettingsScreen
import com.screenless.app.ui.screens.SignInScreen
import com.screenless.app.ui.screens.StreaksScreen

object Routes {
    const val Onboarding = "onboarding"
    const val SignIn = "signin"
    const val Home = "home"
    const val Live = "live/{windowId}"
    const val Groups = "groups"
    const val Create = "create"
    const val Streaks = "streaks"
    const val Reflect = "reflect/{windowId}"
    const val Settings = "settings"
}

@Composable
fun ScreenLessNav() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = Routes.Onboarding) {
        composable(Routes.Onboarding) {
            OnboardingScreen(onContinue = { nav.navigate(Routes.SignIn) })
        }
        composable(Routes.SignIn) {
            SignInScreen(onSignedIn = {
                nav.navigate(Routes.Home) { popUpTo(Routes.Onboarding) { inclusive = true } }
            })
        }
        composable(Routes.Home) {
            HomeScreen(
                onOpenLive = { nav.navigate("live/$it") },
                onGroups = { nav.navigate(Routes.Groups) },
                onCreate = { nav.navigate(Routes.Create) },
                onStreaks = { nav.navigate(Routes.Streaks) },
                onSettings = { nav.navigate(Routes.Settings) },
            )
        }
        composable(Routes.Live, arguments = listOf(navArgument("windowId") { type = NavType.StringType })) {
            LiveRoomScreen(
                windowId = it.arguments?.getString("windowId").orEmpty(),
                onBack = { nav.popBackStack() },
                onEnded = { id -> nav.navigate("reflect/$id") },
            )
        }
        composable(Routes.Groups) { GroupsScreen(onBack = { nav.popBackStack() }) }
        composable(Routes.Create) { CreateWindowScreen(onBack = { nav.popBackStack() }) }
        composable(Routes.Streaks) { StreaksScreen(onBack = { nav.popBackStack() }) }
        composable(Routes.Reflect, arguments = listOf(navArgument("windowId") { type = NavType.StringType })) {
            ReflectionScreen(
                windowId = it.arguments?.getString("windowId").orEmpty(),
                onDone = { nav.navigate(Routes.Home) { popUpTo(Routes.Home) { inclusive = true } } },
            )
        }
        composable(Routes.Settings) { SettingsScreen(onBack = { nav.popBackStack() }) }
    }
}
