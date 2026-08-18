package com.screenless.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Forest = Color(0xFF1B3A2F)
val ForestDeep = Color(0xFF0F1F1A)
val Sage = Color(0xFF4A7C59)
val SageSoft = Color(0xFF7BA888)
val Cream = Color(0xFFF4EFE4)
val CreamDeep = Color(0xFFE8DFD0)
val Clay = Color(0xFFC4785A)
val Ink = Color(0xFF1A1814)
val Paper = Color(0xFFFAF7F0)

private val Colors = lightColorScheme(
    primary = Forest,
    onPrimary = Cream,
    secondary = Clay,
    onSecondary = Cream,
    background = Cream,
    onBackground = Ink,
    surface = Paper,
    onSurface = Ink,
    tertiary = Sage,
)

private val Type = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Medium,
        fontSize = 42.sp,
        lineHeight = 46.sp,
        color = Forest,
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Medium,
        fontSize = 28.sp,
        lineHeight = 34.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Medium,
        fontSize = 22.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontSize = 16.sp,
        lineHeight = 24.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        letterSpacing = 0.6.sp,
    ),
)

@Composable
fun ScreenLessTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = Colors, typography = Type, content = content)
}
