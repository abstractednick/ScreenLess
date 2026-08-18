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
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.components.Avatar
import com.screenless.app.ui.preview.Demo
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink
import com.screenless.app.ui.theme.Paper

@Composable
fun GroupsScreen(onBack: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Cream)
            .padding(24.dp),
    ) {
        TextButton(onClick = onBack) { Text("Back", color = Forest) }
        Text("Your circles", color = Forest, style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)
        Text("Private by design. No public feed.", color = Ink.copy(alpha = 0.65f))
        Spacer(Modifier.height(20.dp))
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Demo.groups.forEach { g ->
                Column(
                    Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(Paper)
                        .padding(18.dp),
                ) {
                    Text(g.name, color = Forest)
                    Text(g.description.orEmpty(), color = Ink.copy(alpha = 0.7f))
                    Spacer(Modifier.height(10.dp))
                    Row {
                        g.members.forEach { Avatar(it, 32.dp) }
                    }
                    Spacer(Modifier.height(8.dp))
                    Text("Invite  ${g.inviteCode}", color = Forest.copy(alpha = 0.8f))
                }
            }
        }
    }
}
