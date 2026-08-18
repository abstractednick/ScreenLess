package com.screenless.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.screenless.app.domain.model.Presence
import com.screenless.app.ui.components.Avatar
import com.screenless.app.ui.preview.Demo
import com.screenless.app.ui.theme.Clay
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink
import com.screenless.app.ui.theme.Paper
import com.screenless.app.ui.theme.SageSoft

@Composable
fun LiveRoomScreen(windowId: String, onBack: () -> Unit, onEnded: (String) -> Unit) {
    val window = Demo.live
    Column(
        Modifier
            .fillMaxSize()
            .background(Forest)
            .padding(20.dp),
    ) {
        TextButton(onClick = onBack) { Text("Leave softly", color = SageSoft) }
        Text("NIGHT OWLS", color = SageSoft)
        Text(window.title, color = Cream, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
        Text("27:12 remaining · phones in the other room", color = Cream.copy(alpha = 0.7f))
        Spacer(Modifier.height(24.dp))
        Column(
            Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            window.participants.forEach { p ->
                Row(
                    Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(Cream.copy(alpha = 0.1f))
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Avatar(p.user, 44.dp)
                    Column(Modifier.weight(1f)) {
                        Text(p.user.displayName, color = Cream)
                        val label = when (p.status) {
                            Presence.FOCUSED -> "Focused"
                            Presence.PEEKED -> "Peeked — and came back"
                            Presence.DROPPED -> "Stepped out"
                            Presence.JOINED -> "Joining"
                        }
                        Text(label, color = if (p.status == Presence.PEEKED) Clay else SageSoft)
                    }
                    Text("${p.focusedPct}%", color = Cream.copy(alpha = 0.8f))
                }
            }
            Spacer(Modifier.height(8.dp))
            Text("Soft signals", color = SageSoft)
            Demo.signals.forEach { s ->
                Box(
                    Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(Paper)
                        .padding(14.dp),
                ) {
                    Column {
                        Text(s.message, color = Forest)
                        Text(s.createdAt, color = Ink.copy(alpha = 0.5f))
                    }
                }
            }
        }
        TextButton(onClick = { onEnded(windowId) }, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text("End window · reflect", color = Cream)
        }
    }
}
