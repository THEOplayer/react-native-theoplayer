package com.theoplayer

import android.view.MotionEvent
import kotlin.math.abs

/**
 * Detects single-pointer taps from the touch events dispatched to the player view.
 *
 * A tap is a pointer that goes down and up again without moving further than [touchSlop] in either direction, and
 * without a second pointer or a cancellation in between. The detector only observes events; it never consumes them.
 *
 * @param touchSlop the maximum distance, in pixels, a pointer may move while still counting as a tap.
 */
internal class PlayerViewTapDetector(private val touchSlop: Float) {
  private var tapCandidate = false
  private var downX = 0f
  private var downY = 0f

  /**
   * Feeds the next touch event to the detector.
   *
   * @param action the masked action of the event, as returned by [MotionEvent.getActionMasked].
   * @param x the x coordinate of the event, in pixels.
   * @param y the y coordinate of the event, in pixels.
   * @return `true` if this event completes a tap.
   */
  fun onTouchEvent(action: Int, x: Float, y: Float): Boolean {
    when (action) {
      MotionEvent.ACTION_DOWN -> {
        tapCandidate = true
        downX = x
        downY = y
      }
      MotionEvent.ACTION_MOVE -> if (abs(x - downX) > touchSlop || abs(y - downY) > touchSlop) tapCandidate = false
      MotionEvent.ACTION_UP -> return tapCandidate.also { tapCandidate = false }
      MotionEvent.ACTION_CANCEL, MotionEvent.ACTION_POINTER_DOWN -> tapCandidate = false
    }
    return false
  }
}
