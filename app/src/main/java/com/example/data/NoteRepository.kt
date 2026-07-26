package com.example.data

import android.util.Log
import com.example.data.api.ApiClient
import com.example.data.api.NoteApiService
import com.example.data.api.UpdateCompletedDto
import com.example.data.api.UpdatePinDto
import com.example.data.api.toCreateDto
import com.example.data.api.toEntity
import com.example.data.api.toUpdateDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

class NoteRepository(
    private val noteDao: NoteDao,
    private val apiService: NoteApiService = ApiClient.noteApiService
) {
    private val tag = "NoteRepository"

    fun getAllNotes(): Flow<List<NoteEntity>> = noteDao.getAllNotes()

    fun searchNotes(query: String): Flow<List<NoteEntity>> = noteDao.searchNotes(query)

    suspend fun refreshFromBackend() = withContext(Dispatchers.IO) {
        try {
            val remoteNotes = apiService.getNotes()
            val entities = remoteNotes.map { it.toEntity() }
            entities.forEach { noteDao.insertNote(it) }
            Log.d(tag, "Successfully refreshed ${entities.size} notes from backend.")
        } catch (e: Exception) {
            Log.e(tag, "Backend sync error during refresh: ${e.message}", e)
        }
    }

    suspend fun insertNote(note: NoteEntity): Long = withContext(Dispatchers.IO) {
        return@withContext try {
            val createdDto = apiService.createNote(note.toCreateDto())
            val entityToSave = createdDto.toEntity()
            noteDao.insertNote(entityToSave)
        } catch (e: Exception) {
            Log.e(tag, "Network error inserting note. Saving locally: ${e.message}")
            noteDao.insertNote(note)
        }
    }

    suspend fun updateNote(note: NoteEntity) = withContext(Dispatchers.IO) {
        try {
            val updatedDto = apiService.updateNote(note.id, note.toUpdateDto())
            noteDao.updateNote(updatedDto.toEntity())
        } catch (e: Exception) {
            Log.e(tag, "Network error updating note. Updating local DB: ${e.message}")
            noteDao.updateNote(note)
        }
    }

    suspend fun deleteNote(note: NoteEntity) = withContext(Dispatchers.IO) {
        try {
            apiService.deleteNote(note.id)
            noteDao.deleteNote(note)
        } catch (e: Exception) {
            Log.e(tag, "Network error deleting note. Deleting from local DB: ${e.message}")
            noteDao.deleteNote(note)
        }
    }

    suspend fun togglePin(id: Int, isPinned: Boolean) = withContext(Dispatchers.IO) {
        try {
            val updatedDto = apiService.updatePinStatus(id, UpdatePinDto(isPinned))
            noteDao.updateNote(updatedDto.toEntity())
        } catch (e: Exception) {
            Log.e(tag, "Network error toggling pin. Updating local DB: ${e.message}")
            noteDao.updatePinStatus(id, isPinned)
        }
    }

    suspend fun toggleCompleted(id: Int, isCompleted: Boolean) = withContext(Dispatchers.IO) {
        try {
            val updatedDto = apiService.updateCompletedStatus(id, UpdateCompletedDto(isCompleted))
            noteDao.updateNote(updatedDto.toEntity())
        } catch (e: Exception) {
            Log.e(tag, "Network error toggling completed. Updating local DB: ${e.message}")
            noteDao.updateCompletedStatus(id, isCompleted)
        }
    }
}
