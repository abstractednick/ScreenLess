package com.screenless.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.theme.Clay
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink

@Composable
fun OnboardingScreen(onContinue: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Cream)
            .padding(28.dp),
        verticalArrangement = Arrangement.SpaceBetween,
    ) {
        Column {
            Text("SCREENLESS", color = Clay)
            Spacer(Modifier.height(28.dp))
            Text(
                "Phone down,\nfriendship up.",
                color = Forest,
                style = androidx.compose.material3.MaterialTheme.typography.displayLarge,
            )
            Spacer(Modifier.height(16.dp))
            Text(
                "Turn putting the phone away into a shared ritual. Windows with your people. Soft signals, never shame.",
                color = Ink.copy(alpha = 0.75f),
            )
        }
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Feature("Shared windows", "Study, walks, hangouts — timed together.")
            Feature("Soft accountability", "“Karan peeked at socials” — not a leaderboard of failure.")
            Feature("Your rules", "You pick which apps count. Signals, not logs.")
            Button(
                onClick = onContinue,
                modifier = Modifier.fillMaxWidth().height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Forest, contentColor = Cream),
                shape = RoundedCornerShape(18.dp),
            ) { Text("Enter the circle") }
        }
    }
}

@Composable
private fun Feature(title: String, body: String) {
    Box(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(Forest.copy(alpha = 0.08f))
            .padding(16.dp),
    ) {
        Column {
            Text(title, color = Forest)
            Text(body, color = Ink.copy(alpha = 0.7f))
        }
    }
}
