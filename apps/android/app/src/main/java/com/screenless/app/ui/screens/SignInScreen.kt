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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest
import com.screenless.app.ui.theme.Ink

@Composable
fun SignInScreen(onSignedIn: () -> Unit) {
    var email by remember { mutableStateOf("maya@screenless.app") }
    var password by remember { mutableStateOf("screenless") }
    Column(
        Modifier
            .fillMaxSize()
            .background(Cream)
            .padding(28.dp),
        verticalArrangement = Arrangement.Center,
    ) {
        Text("Welcome back.", color = Forest, style = androidx.compose.material3.MaterialTheme.typography.displayLarge)
        Spacer(Modifier.height(8.dp))
        Text("Demo circle is already seeded. Maya, Karan, Jules are in Night Owls.", color = Ink.copy(alpha = 0.7f))
        Spacer(Modifier.height(28.dp))
        OutlinedTextField(email, { email = it }, label = { Text("Email") }, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(
            password,
            { password = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(24.dp))
        Button(
            onClick = onSignedIn,
            modifier = Modifier.fillMaxWidth().height(54.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Forest, contentColor = Cream),
            shape = RoundedCornerShape(18.dp),
        ) { Text("Sit down with them") }
    }
}
