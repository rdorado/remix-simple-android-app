package com.example.data.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface NoteApiService {

    @GET("api/notes")
    suspend fun getNotes(
        @Query("query") query: String? = null,
        @Query("category") category: String? = null
    ): List<NoteDto>

    @GET("api/notes/{id}")
    suspend fun getNoteById(@Path("id") id: Int): NoteDto

    @POST("api/notes")
    suspend fun createNote(@Body note: CreateNoteDto): NoteDto

    @PUT("api/notes/{id}")
    suspend fun updateNote(
        @Path("id") id: Int,
        @Body note: UpdateNoteDto
    ): NoteDto

    @DELETE("api/notes/{id}")
    suspend fun deleteNote(@Path("id") id: Int): Response<Unit>

    @PATCH("api/notes/{id}/pin")
    suspend fun updatePinStatus(
        @Path("id") id: Int,
        @Body request: UpdatePinDto
    ): NoteDto

    @PATCH("api/notes/{id}/complete")
    suspend fun updateCompletedStatus(
        @Path("id") id: Int,
        @Body request: UpdateCompletedDto
    ): NoteDto

    @POST("api/notes/seed")
    suspend fun seedNotes(): List<NoteDto>
}
