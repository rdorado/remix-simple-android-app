package com.example.data.api

import com.example.data.NoteEntity
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class NoteDto(
    @param:Json(name = "id") val id: Int = 0,
    @param:Json(name = "title") val title: String,
    @param:Json(name = "content") val content: String,
    @param:Json(name = "category") val category: String = "Personal",
    @param:Json(name = "isPinned") val isPinned: Boolean = false,
    @param:Json(name = "isCompleted") val isCompleted: Boolean = false,
    @param:Json(name = "colorHex") val colorHex: String = "#FFF8E1",
    @param:Json(name = "timestamp") val timestamp: Long = System.currentTimeMillis()
)

@JsonClass(generateAdapter = true)
data class CreateNoteDto(
    @param:Json(name = "title") val title: String,
    @param:Json(name = "content") val content: String,
    @param:Json(name = "category") val category: String,
    @param:Json(name = "isPinned") val isPinned: Boolean,
    @param:Json(name = "isCompleted") val isCompleted: Boolean = false,
    @param:Json(name = "colorHex") val colorHex: String
)

@JsonClass(generateAdapter = true)
data class UpdateNoteDto(
    @param:Json(name = "title") val title: String,
    @param:Json(name = "content") val content: String,
    @param:Json(name = "category") val category: String,
    @param:Json(name = "isPinned") val isPinned: Boolean,
    @param:Json(name = "isCompleted") val isCompleted: Boolean,
    @param:Json(name = "colorHex") val colorHex: String
)

@JsonClass(generateAdapter = true)
data class UpdatePinDto(
    @param:Json(name = "isPinned") val isPinned: Boolean
)

@JsonClass(generateAdapter = true)
data class UpdateCompletedDto(
    @param:Json(name = "isCompleted") val isCompleted: Boolean
)

// Extension functions for mapping
fun NoteDto.toEntity(): NoteEntity {
    return NoteEntity(
        id = id,
        title = title,
        content = content,
        category = category,
        isPinned = isPinned,
        isCompleted = isCompleted,
        colorHex = colorHex,
        timestamp = timestamp
    )
}

fun NoteEntity.toCreateDto(): CreateNoteDto {
    return CreateNoteDto(
        title = title,
        content = content,
        category = category,
        isPinned = isPinned,
        isCompleted = isCompleted,
        colorHex = colorHex
    )
}

fun NoteEntity.toUpdateDto(): UpdateNoteDto {
    return UpdateNoteDto(
        title = title,
        content = content,
        category = category,
        isPinned = isPinned,
        isCompleted = isCompleted,
        colorHex = colorHex
    )
}
