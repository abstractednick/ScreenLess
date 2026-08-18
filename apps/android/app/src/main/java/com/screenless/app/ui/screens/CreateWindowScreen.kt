package com.screenless.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.CreamDeep
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink

@Composable
fun CreateWindowScreen(onBack: () -> Unit) {
    var title by remember { mutableStateOf("Library lamps") }
    var context by remember { mutableStateOf("STUDY") }
    val contexts = listOf("STUDY", "WALK", "SOCIAL", "DEEP_WORK", "SELF_CARE")
    Column(
        Modifier
            .fillMaxSize()
            .background(Cream)
            .padding(24.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back", color = Forest) }
        Text("Open a window", color = Forest, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
        Text("A window is a promise with a clock. Friends can still peek — you’ll just know, softly.", color = Ink.copy(alpha = 0.7f))
        Spacer(Modifier.height(20.dp))
        OutlinedTextField(title, { title = it }, label = { Text("Title") }, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(16.dp))
        Text("Context", color = Forest)
        Spacer(Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            contexts.take(3).forEach { c ->
                val selected = c == context
                Box(
                    Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (selected) Forest else CreamDeep)
                        .clickable { context = c }
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                ) { Text(c.lowercase().replace('_', ' '), color = if (selected) Cream else Forest) }
            }
        }
        Spacer(Modifier.height(16.dp))
        Text("Discouraged for this window", color = Forest)
        Text("Instagram · TikTok · YouTube · X", color = Ink.copy(alpha = 0.65f))
        Spacer(Modifier.height(24.dp))
        Button(
            onClick = onBack,
            modifier = Modifier.fillMaxWidth().height(54.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Forest, contentColor = Cream),
            shape = RoundedCornerShape(18.dp),
        ) { Text("Invite Night Owls · 45 min") }
    }
}
