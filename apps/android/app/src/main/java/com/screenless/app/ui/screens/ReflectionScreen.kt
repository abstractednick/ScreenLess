package com.screenless.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink

@Composable
fun ReflectionScreen(windowId: String, onDone: () -> Unit) {
    var answer by remember { mutableStateOf("") }
    Column(
        Modifier
            .fillMaxSize()
            .background(Cream)
            .padding(28.dp),
    ) {
        Text("Window closed.", color = Forest, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        Text("Two lines. That’s the whole ritual. $windowId".take(0) + "How did it feel?", color = Ink.copy(alpha = 0.75f))
        Spacer(Modifier.height(20.dp))
        OutlinedTextField(
            answer,
            { answer = it },
            placeholder = { Text("Quieter than I expected. Finished the chapter.") },
            modifier = Modifier.fillMaxWidth().height(160.dp),
        )
        Spacer(Modifier.height(20.dp))
        Button(
            onClick = onDone,
            modifier = Modifier.fillMaxWidth().height(54.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Forest, contentColor = Cream),
            shape = RoundedCornerShape(18.dp),
        ) { Text("Keep this in the log") }
    }
}
