package com.clearexam.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import com.clearexam.android.core.data.repository.AuthRepository
import com.clearexam.android.core.data.repository.AuthState
import com.clearexam.android.core.designsystem.theme.ClearExamTheme
import com.clearexam.android.feature.auth.LoginScreen
import com.clearexam.android.feature.home.HomeScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val authRepository = remember { AuthRepository() }
            val authState by authRepository.authState.collectAsState()

            ClearExamTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    when (authState) {
                        is AuthState.Authenticated -> {
                            HomeScreen()
                        }
                        else -> {
                            LoginScreen(
                                isLoading = authState is AuthState.Loading,
                                onGoogleSignInClick = {
                                    // Trigger Google One-Tap or Intent flow
                                },
                                onGuestContinueClick = {
                                    authRepository.signInAsGuest()
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
