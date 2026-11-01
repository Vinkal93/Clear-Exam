package com.clearexam.android.core.data.model

data class User(
    val uid: String,
    val email: String?,
    val displayName: String,
    val photoUrl: String?,
    val role: String,
    val targetExamId: String?,
    val isAnonymous: Boolean = false
) {
    val isStudent: Boolean get() = role.equals("STUDENT", ignoreCase = true)
    val isStaff: Boolean get() = !isStudent
}
