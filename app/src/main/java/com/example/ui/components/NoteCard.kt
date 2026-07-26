package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PushPin
import androidx.compose.material.icons.outlined.PushPin
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.NoteEntity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun NoteCard(
    note: NoteEntity,
    onClick: () -> Unit,
    onDelete: () -> Unit,
    onTogglePin: () -> Unit,
    onToggleCompleted: () -> Unit,
    modifier: Modifier = Modifier
) {
    val cardBgColor = try {
        Color(android.graphics.Color.parseColor(note.colorHex))
    } catch (e: Exception) {
        MaterialTheme.colorScheme.surfaceVariant
    }

    val animatedColor by animateColorAsState(targetValue = cardBgColor, label = "cardColor")

    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("note_card_${note.id}")
            .combinedClickable(
                onClick = onClick
            ),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = animatedColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Header Row: Category Tag & Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surface.copy(alpha = 0.7f)
                ) {
                    Text(
                        text = note.category,
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = onTogglePin,
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("pin_note_${note.id}")
                    ) {
                        Icon(
                            imageVector = if (note.isPinned) Icons.Filled.PushPin else Icons.Outlined.PushPin,
                            contentDescription = if (note.isPinned) "Unpin note" else "Pin note",
                            tint = if (note.isPinned) MaterialTheme.colorScheme.primary else Color.Gray
                        )
                    }

                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("delete_note_${note.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete note",
                            tint = MaterialTheme.colorScheme.error.copy(alpha = 0.8f)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Checkbox and Title Row
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Checkbox(
                    checked = note.isCompleted,
                    onCheckedChange = { onToggleCompleted() },
                    modifier = Modifier.testTag("check_note_${note.id}"),
                    colors = CheckboxDefaults.colors(
                        checkedColor = MaterialTheme.colorScheme.primary
                    )
                )

                Spacer(modifier = Modifier.width(4.dp))

                Text(
                    text = note.title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        textDecoration = if (note.isCompleted) TextDecoration.LineThrough else TextDecoration.None
                    ),
                    fontWeight = FontWeight.Bold,
                    color = if (note.isCompleted) Color.Gray else MaterialTheme.colorScheme.onSurface,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
            }

            if (note.content.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = note.content,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (note.isCompleted) Color.Gray else MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 4,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 20.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Footer Timestamp
            val dateFormatted = SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault())
                .format(Date(note.timestamp))

            Text(
                text = dateFormatted,
                style = MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
        }
    }
}
