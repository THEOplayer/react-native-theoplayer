package com.theoplayer.media

import android.app.ActivityManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * A MediaButtonReceiver that only forwards MediaButton events if the MediaPlaybackService is
 * running, otherwise ignore the event.
 * This avoid the service is being restarted when the parent app was closed.
 * It also avoids the ForegroundServiceDidNotStartInTimeException, which is sent when the
 * service doesn't start in time (within 5 seconds) due to heavy load.
 */
class ConditionalMediaButtonReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (Intent.ACTION_MEDIA_BUTTON == intent.action) {
            // Only send the intent if service is already running.
            if (isServiceRunning(context, MediaPlaybackService::class.java)) {
                intent.setClass(context, MediaPlaybackService::class.java)
                context.startService(intent)
            }
        }
    }

    private fun isServiceRunning(context: Context, serviceClass: Class<*>): Boolean {
        val am = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        @Suppress("DEPRECATION") // Only alternative is usage stats, heavier
        val runningServices = am.getRunningServices(Int.MAX_VALUE)
        for (service in runningServices) {
            if (serviceClass.name == service.service.className) {
                return true
            }
        }
        return false
    }
}
