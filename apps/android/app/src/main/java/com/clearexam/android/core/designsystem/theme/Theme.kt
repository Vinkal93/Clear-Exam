package com.clearexam.android.core.designsystem.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = PrimaryIndigo,
    onPrimary = SurfaceWhite,
    primaryContainer = PrimaryIndigoLight,
    onPrimaryContainer = PrimaryNavy,
    secondary = AccentTeal,
    onSecondary = SurfaceWhite,
    secondaryContainer = AccentTealLight,
    background = SurfaceOffWhite,
    onBackground = TextMain,
    surface = SurfaceWhite,
    onSurface = TextMain,
    surfaceVariant = SurfaceOffWhite,
    onSurfaceVariant = TextMuted,
    outline = BorderSubtle,
    error = DestructiveCrimson,
    onError = SurfaceWhite
)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryIndigo,
    onPrimary = SurfaceWhite,
    secondary = AccentTeal,
    background = PrimaryNavy,
    surface = PrimaryNavy,
    error = DestructiveCrimson
)

@Composable
fun ClearExamTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = ClearExamTypography,
        content = content
    )
}
