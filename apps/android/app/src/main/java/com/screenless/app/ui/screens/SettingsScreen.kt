package com.screenless.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink
import com.screenless.app.ui.theme.Paper
import com.screenless.app.ui.theme.SageSoft

@Composable
fun SettingsScreen(onBack: () -> Unit) {
    data class Pref(val name: String, val hint: String, val on: Boolean)
    var prefs by remember {
        mutableStateOf(
            listOf(
                Pref("Social apps", "Instagram, TikTok, X — only during live windows", true),
                Pref("Video", "YouTube, Reels-likes", true),
                Pref("Games", "Off by default. You opt in.", false),
                Pref("Messaging", "Never treated as a peek unless you say so.", false),
            ),
        )
    }
    Column(
        Modifier
            .fillMaxSize()
            .background(Cream)
            .padding(24.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back", color = Forest) }
        Text("Privacy & consent", color = Forest, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
        Text("Friends see a signal. Nobody sees a dossier. Tracking is window-scoped and category-level.", color = Ink.copy(alpha = 0.7f))
        Spacer(Modifier.height(20.dp))
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            prefs.forEachIndexed { i, p ->
                Row(
                    Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(Paper)
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(Modifier.weight(1f)) {
                        Text(p.name, color = Forest)
                        Text(p.hint, color = Ink.copy(alpha = 0.6f))
                    }
                    Switch(
                        checked = p.on,
                        onCheckedChange = { on ->
                            prefs = prefs.toMutableList().also { it[i] = p.copy(on = on) }
                        },
                        colors = SwitchDefaults.colors(checkedTrackColor = Forest, checkedThumbColor = SageSoft),
                    )
                }
            }
        }
        Spacer(Modifier.height(24.dp))
        Text("Delete my account and all signals", color = Forest.copy(alpha = 0.8f))
        Text("Retention is short. Reflections stay only if you keep them.", color = Ink.copy(alpha = 0.55f))
    }
}
