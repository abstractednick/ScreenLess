package com.screenless.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.screenless.app.domain.model.User
import com.screenless.app.ui.theme.Cream
import com.screenless.app.ui.theme.Forest

@Composable
fun Avatar(user: User, size: Dp = 40.dp) {
    val bg = Color.hsv(user.avatarHue.toFloat(), 0.35f, 0.45f)
    Box(
        modifier = Modifier
            .size(size)
            .clip(CircleShape)
            .background(bg),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            user.displayName.take(1),
            color = Cream,
            fontSize = (size.value * 0.4f).sp,
        )
    }
}

@Composable
fun StatusDot(focused: Boolean) {
    Box(
        Modifier
            .size(8.dp)
            .clip(CircleShape)
            .background(if (focused) Forest else Color(0xFFC4785A)),
    )
}
