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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.components.Avatar
import com.screenless.app.ui.preview.Demo
import com.screenless.app.ui.theme.Clay
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.CreamDeep
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink
import com.screenless.app.ui.theme.Paper
import com.screenless.app.ui.theme.SageSoft

@Composable
fun HomeScreen(
    onOpenLive: (String) -> Unit,
    onGroups: () -> Unit,
    onCreate: () -> Unit,
    onStreaks: () -> Unit,
    onSettings: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Cream)
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
    ) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Column {
                Text("Good evening, Maya", color = Ink.copy(alpha = 0.6f))
                Text("Your window is open.", color = Forest, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
            }
            Avatar(Demo.maya, 44.dp)
        }
        Spacer(Modifier.height(24.dp))
        Box(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(28.dp))
                .background(Forest)
                .clickable { onOpenLive(Demo.live.id) }
                .padding(22.dp),
        ) {
            Column {
                Text("LIVE · NIGHT OWLS", color = SageSoft)
                Spacer(Modifier.height(8.dp))
                Text("Library lamps", color = Cream, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
                Text("27 minutes left · 3 in the room", color = Cream.copy(alpha = 0.75f))
                Spacer(Modifier.height(16.dp))
                Row {
                    Demo.live.participants.forEach {
                        Avatar(it.user, 36.dp)
                        Spacer(Modifier.width(8.dp))
                    }
                }
            }
        }
        Spacer(Modifier.height(20.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            StatChip("12 day streak", Modifier.weight(1f), onStreaks)
            StatChip("2 circles", Modifier.weight(1f), onGroups)
        }
        Spacer(Modifier.height(28.dp))
        Text("Later tonight", color = Forest)
        Spacer(Modifier.height(10.dp))
        Box(
            Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(Paper)
                .padding(18.dp),
        ) {
            Column {
                Text("Studio quiet hour", color = Forest)
                Text("Jules · Night Owls · 60 min · Deep work", color = Ink.copy(alpha = 0.65f))
            }
        }
        Spacer(Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Action("New window", onCreate, Modifier.weight(1f))
            Action("Privacy", onSettings, Modifier.weight(1f))
        }
    }
}

@Composable
private fun StatChip(label: String, modifier: Modifier, onClick: () -> Unit) {
    Box(
        modifier
            .clip(RoundedCornerShape(20.dp))
            .background(CreamDeep)
            .clickable(onClick = onClick)
            .padding(16.dp),
    ) { Text(label, color = Forest) }
}

@Composable
private fun Action(label: String, onClick: () -> Unit, modifier: Modifier) {
    Box(
        modifier
            .clip(RoundedCornerShape(20.dp))
            .background(Clay.copy(alpha = 0.15f))
            .clickable(onClick = onClick)
            .padding(16.dp),
        contentAlignment = Alignment.Center,
    ) { Text(label, color = Clay) }
}
