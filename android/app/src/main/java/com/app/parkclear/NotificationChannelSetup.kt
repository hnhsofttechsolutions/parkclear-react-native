package com.app.parkclear

import android.app.NotificationChannel
import android.app.NotificationManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build

object NotificationChannelSetup {
  const val CHANNEL_ID = "parkclear_alerts_v2"
  private const val LEGACY_CHANNEL_ID = "parkclear_alerts"

  fun createDefaultChannel(application: android.app.Application) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val notificationManager =
      application.getSystemService(NotificationManager::class.java) ?: return

    notificationManager.deleteNotificationChannel(LEGACY_CHANNEL_ID)

    if (notificationManager.getNotificationChannel(CHANNEL_ID) != null) {
      return
    }

    val soundUri =
      Uri.parse("android.resource://${application.packageName}/${R.raw.noti_tune}")
    val audioAttributes =
      AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build()

    val channel =
      NotificationChannel(
        CHANNEL_ID,
        "ParkClear Alerts",
        NotificationManager.IMPORTANCE_HIGH,
      ).apply {
        description = "Parking alerts and reminders"
        enableVibration(true)
        vibrationPattern = longArrayOf(0, 300, 200, 300, 200)
        setSound(soundUri, audioAttributes)
      }

    notificationManager.createNotificationChannel(channel)
  }
}
