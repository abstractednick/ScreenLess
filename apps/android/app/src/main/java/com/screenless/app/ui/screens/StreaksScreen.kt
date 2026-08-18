package com.screenless.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.preview.Demo
import com.screenless.app.ui.theme.Clay
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink
import com.screenless.app.ui.theme.Paper

@Composable
fun StreaksScreen(onBack: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Cream)
            .padding(24.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back", color = Forest) }
        Text("Your garden", color = Forest, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
        Text("Streaks grow when you finish windows. Cosmetic only — nothing locked behind shame.", color = Ink.copy(alpha = 0.7f))
        Spacer(Modifier.height(20.dp))
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Demo.streaks.forEach { s ->
                Column(
                    Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(Paper)
                        .padding(18.dp),
                ) {
                    Text("${s.current} days · ${s.context}${s.groupName?.let { " · $it" } ?: ""}", color = Forest)
                    Text("Longest ${s.longest}", color = Ink.copy(alpha = 0.6f))
                }
            }
        }
        Spacer(Modifier.height(24.dp))
        Text("Badges", color = Forest)
        Spacer(Modifier.height(8.dp))
        Demo.badges.forEach { b ->
            Column(Modifier.padding(vertical = 8.dp)) {
                Text(b.name, color = Clay)
                Text(b.description, color = Ink.copy(alpha = 0.7f))
            }
        }
    }
}
