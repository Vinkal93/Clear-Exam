package com.clearexam.android.core.data.model

data class ExamCategory(
    val id: String,
    val title: String,
    val titleHindi: String? = null,
    val slug: String,
    val displayOrder: Int = 0
)

data class ExamItem(
    val id: String,
    val categoryId: String,
    val title: String,
    val titleHindi: String? = null,
    val code: String,
    val conductingBody: String? = null,
    val durationMinutes: Int = 180,
    val totalQuestions: Int = 90
)
