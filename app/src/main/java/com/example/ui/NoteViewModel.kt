package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.NoteEntity
import com.example.data.NoteRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class NoteViewModel(private val repository: NoteRepository) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _isAddEditOpen = MutableStateFlow(false)
    val isAddEditOpen: StateFlow<Boolean> = _isAddEditOpen.asStateFlow()

    private val _currentNoteToEdit = MutableStateFlow<NoteEntity?>(null)
    val currentNoteToEdit: StateFlow<NoteEntity?> = _currentNoteToEdit.asStateFlow()

    @OptIn(ExperimentalCoroutinesApi::class)
    private val rawNotesFlow = _searchQuery.flatMapLatest { query ->
        if (query.isBlank()) {
            repository.getAllNotes()
        } else {
            repository.searchNotes(query)
        }
    }

    val notes: StateFlow<List<NoteEntity>> = combine(
        rawNotesFlow,
        _selectedCategory
    ) { notesList, category ->
        if (category == "All") {
            notesList
        } else {
            notesList.filter { it.category.equals(category, ignoreCase = true) }
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    init {
        // Refresh notes from backend API, and seed if still empty
        viewModelScope.launch {
            repository.refreshFromBackend()
            val existing = repository.getAllNotes().first()
            if (existing.isEmpty()) {
                seedInitialNotes()
            }
        }
    }

    fun refreshNotes() {
        viewModelScope.launch {
            repository.refreshFromBackend()
        }
    }

    private suspend fun seedInitialNotes() {
        val sampleNotes = listOf(
            NoteEntity(
                title = "Welcome to Simple Notes",
                content = "Tap the + button to capture quick ideas, daily to-dos, or notes. Filter by category above or pin important notes!",
                category = "Ideas",
                isPinned = true,
                colorHex = "#FEF3C7"
            ),
            NoteEntity(
                title = "Grocery Shopping List",
                content = "Fresh veggies, Almond Milk, Dark Chocolate, Oat cereal, and Organic coffee beans.",
                category = "Tasks",
                isPinned = false,
                colorHex = "#E0E7FF"
            ),
            NoteEntity(
                title = "Weekly Project Ideas",
                content = "1. Design a clean task dashboard\n2. Add custom color tags\n3. Test responsive layout on tablet",
                category = "Work",
                isPinned = false,
                colorHex = "#D1FAE5"
            )
        )
        sampleNotes.forEach { repository.insertNote(it) }
    }

    fun onSearchQueryChange(newQuery: String) {
        _searchQuery.value = newQuery
    }

    fun onCategorySelect(category: String) {
        _selectedCategory.value = category
    }

    fun openAddNote() {
        _currentNoteToEdit.value = null
        _isAddEditOpen.value = true
    }

    fun openEditNote(note: NoteEntity) {
        _currentNoteToEdit.value = note
        _isAddEditOpen.value = true
    }

    fun closeAddEditDialog() {
        _isAddEditOpen.value = false
        _currentNoteToEdit.value = null
    }

    fun saveNote(
        title: String,
        content: String,
        category: String,
        colorHex: String,
        isPinned: Boolean
    ) {
        viewModelScope.launch {
            val noteToSave = _currentNoteToEdit.value
            if (noteToSave != null) {
                repository.updateNote(
                    noteToSave.copy(
                        title = title,
                        content = content,
                        category = category,
                        colorHex = colorHex,
                        isPinned = isPinned,
                        timestamp = System.currentTimeMillis()
                    )
                )
            } else {
                repository.insertNote(
                    NoteEntity(
                        title = title,
                        content = content,
                        category = category,
                        colorHex = colorHex,
                        isPinned = isPinned
                    )
                )
            }
            closeAddEditDialog()
        }
    }

    fun deleteNote(note: NoteEntity) {
        viewModelScope.launch {
            repository.deleteNote(note)
        }
    }

    fun togglePin(note: NoteEntity) {
        viewModelScope.launch {
            repository.togglePin(note.id, !note.isPinned)
        }
    }

    fun toggleCompleted(note: NoteEntity) {
        viewModelScope.launch {
            repository.toggleCompleted(note.id, !note.isCompleted)
        }
    }
}

class NoteViewModelFactory(private val repository: NoteRepository) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(NoteViewModel::class.java)) {
            return NoteViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
