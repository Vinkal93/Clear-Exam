package com.clearexam.android.core.data.repository

import com.clearexam.android.core.data.model.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

sealed interface AuthState {
    data object Unauthenticated : AuthState
    data object Loading : AuthState
    data class Authenticated(val user: User) : AuthState
    data class Error(val message: String) : AuthState
}

class AuthRepository {
    private val _authState = MutableStateFlow<AuthState>(AuthState.Unauthenticated)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    fun signInAsGuest() {
        val guestUser = User(
            uid = "guest_${System.currentTimeMillis()}",
            email = null,
            displayName = "Guest Aspirant",
            photoUrl = null,
            role = "STUDENT",
            targetExamId = null,
            isAnonymous = true
        )
        _authState.value = AuthState.Authenticated(guestUser)
    }

    fun setAuthenticatedUser(user: User) {
        _authState.value = AuthState.Authenticated(user)
    }

    fun signOut() {
        _authState.value = AuthState.Unauthenticated
    }
}
