package com.example.data.api

import com.example.data.NoteEntity
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class NoteDto(
    @Json(name = "id") val id: Int = 0,
    @Json(name = "title") val title: String,
    @Json(name = "content") val content: String,
    @Json(name = "category") val category: String = "Personal",
    @Json(name = "isPinned") val isPinned: Boolean = false,
    @Json(name = "isCompleted") val isCompleted: Boolean = false,
    @Json(name = "colorHex") val colorHex: String = "#FFF8E1",
    @Json(name = "timestamp") val timestamp: Long = System.currentTimeMillis()
)

@JsonClass(generateAdapter = true)
data class CreateNoteDto(
    @Json(name = "title") val title: String,
    @Json(name = "content") val content: String,
    @Json(name = "category") val category: String,
    @Json(name = "isPinned") val isPinned: Boolean,
    @Json(name = "isCompleted") val isCompleted: Boolean = false,
    @Json(name = "colorHex") val colorHex: String
)

@JsonClass(generateAdapter = true)
data class UpdateNoteDto(
    @Json(name = "title") val title: String,
    @Json(name = "content") val content: String,
    @Json(name = "category") val category: String,
    @Json(name = "isPinned") val isPinned: Boolean,
    @Json(name = "isCompleted") val isCompleted: Boolean,
    @Json(name = "colorHex") val colorHex: String
)

@JsonClass(generateAdapter = true)
data class UpdatePinDto(
    @Json(name = "isPinned") val isPinned: Boolean
)

@JsonClass(generateAdapter = true)
data class UpdateCompletedDto(
    @Json(name = "isCompleted") val isCompleted: Boolean
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
