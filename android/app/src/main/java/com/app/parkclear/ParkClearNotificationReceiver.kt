package com.app.parkclear

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * Vibrates on every FCM push — works in foreground, background, and killed state.
 * JS Vibration API does not run reliably from headless FCM handlers on Android.
 */
class ParkClearNotificationReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    if (intent?.extras == null) {
      return
    }

    try {
      VibrationHelper.vibrate(context.applicationContext)
    } catch (error: Exception) {
      Log.w(TAG, "Push vibration failed", error)
    }
  }

  companion object {
    private const val TAG = "ParkClearNotifReceiver"
  }
}
