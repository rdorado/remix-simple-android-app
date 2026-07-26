package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.NoteEntity

val NoteColors = listOf(
    "#FFF8E1", // Warm Light Yellow
    "#E0E7FF", // Soft Lavender
    "#D1FAE5", // Soft Mint
    "#FCE7F3", // Soft Pink
    "#FEF3C7", // Pastel Orange
    "#E0F2FE", // Sky Blue
    "#F3F4F6"  // Neutral Grey
)

val NoteCategories = listOf("Personal", "Work", "Ideas", "Tasks")

@Composable
fun AddEditNoteDialog(
    note: NoteEntity?,
    onDismiss: () -> Unit,
    onSave: (title: String, content: String, category: String, colorHex: String, isPinned: Boolean) -> Unit
) {
    var title by remember(note) { mutableStateOf(note?.title ?: "") }
    var content by remember(note) { mutableStateOf(note?.content ?: "") }
    var category by remember(note) { mutableStateOf(note?.category ?: "Personal") }
    var colorHex by remember(note) { mutableStateOf(note?.colorHex ?: NoteColors.first()) }
    var isPinned by remember(note) { mutableStateOf(note?.isPinned ?: false) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .padding(16.dp),
            shape = RoundedCornerShape(28.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (note == null) "Create New Note" else "Edit Note",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close dialog")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Title Input
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Note Title") },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_title"),
                    shape = RoundedCornerShape(16.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Content Input
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    label = { Text("Content / Details") },
                    minLines = 4,
                    maxLines = 8,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_content"),
                    shape = RoundedCornerShape(16.dp)
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Category Selection
                Text(
                    text = "Category",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(NoteCategories) { item ->
                        FilterChip(
                            selected = category.equals(item, ignoreCase = true),
                            onClick = { category = item },
                            label = { Text(item) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Color Selection Palette
                Text(
                    text = "Card Tint Color",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    NoteColors.forEach { hex ->
                        val color = try {
                            Color(android.graphics.Color.parseColor(hex))
                        } catch (e: Exception) {
                            Color.LightGray
                        }
                        val isSelected = colorHex.equals(hex, ignoreCase = true)

                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(color)
                                .border(
                                    width = if (isSelected) 3.dp else 1.dp,
                                    color = if (isSelected) MaterialTheme.colorScheme.primary else Color.Gray.copy(alpha = 0.5f),
                                    shape = CircleShape
                                )
                                .clickable { colorHex = hex },
                            contentAlignment = Alignment.Center
                        ) {
                            if (isSelected) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = "Selected color",
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Pin Switch Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Pin to Top",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Switch(
                        checked = isPinned,
                        onCheckedChange = { isPinned = it }
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Cancel")
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (title.isNotBlank() || content.isNotBlank()) {
                                onSave(
                                    if (title.isBlank()) "Untitled" else title,
                                    content,
                                    category,
                                    colorHex,
                                    isPinned
                                )
                            }
                        },
                        enabled = title.isNotBlank() || content.isNotBlank(),
                        modifier = Modifier.testTag("save_note_button"),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Save Note")
                    }
                }
            }
        }
    }
}
