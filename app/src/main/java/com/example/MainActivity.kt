package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.data.AppDatabase
import com.example.data.NoteRepository
import com.example.ui.NoteScreen
import com.example.ui.NoteViewModel
import com.example.ui.NoteViewModelFactory
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  private val database by lazy { AppDatabase.getDatabase(this) }
  private val repository by lazy { NoteRepository(database.noteDao()) }
  private val noteViewModel: NoteViewModel by viewModels { NoteViewModelFactory(repository) }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
          NoteScreen(viewModel = noteViewModel)
        }
      }
    }
  }
}

