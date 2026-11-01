package com.clearexam.android.core.data.repository

import com.clearexam.android.core.data.model.ExamCategory
import com.clearexam.android.core.data.model.ExamItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class CatalogRepository {
    private val _categories = MutableStateFlow<List<ExamCategory>>(emptyList())
    val categories: StateFlow<List<ExamCategory>> = _categories.asStateFlow()

    private val _exams = MutableStateFlow<List<ExamItem>>(emptyList())
    val exams: StateFlow<List<ExamItem>> = _exams.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    fun updateCategories(newCategories: List<ExamCategory>) {
        _categories.value = newCategories
    }

    fun updateExams(newExams: List<ExamItem>) {
        _exams.value = newExams
    }

    fun setLoading(loading: Boolean) {
        _isLoading.value = loading
    }
}
