package com.theoplayer

import android.view.MotionEvent
import org.junit.Assert.assertEquals
import org.junit.Test

class PlayerViewTapDetectorTest {
  private val detector = PlayerViewTapDetector(touchSlop = 10f)

  private fun taps(vararg events: Triple<Int, Float, Float>): Int =
    events.count { (action, x, y) -> detector.onTouchEvent(action, x, y) }

  @Test
  fun downAndUpInPlaceIsOneTap() {
    assertEquals(1, taps(Triple(MotionEvent.ACTION_DOWN, 100f, 100f), Triple(MotionEvent.ACTION_UP, 100f, 100f)))
  }

  @Test
  fun movementWithinTouchSlopIsStillATap() {
    assertEquals(
      1,
      taps(
        Triple(MotionEvent.ACTION_DOWN, 100f, 100f),
        Triple(MotionEvent.ACTION_MOVE, 106f, 94f),
        Triple(MotionEvent.ACTION_UP, 106f, 94f),
      ),
    )
  }

  @Test
  fun dragBeyondTouchSlopIsNotATap() {
    assertEquals(
      0,
      taps(
        Triple(MotionEvent.ACTION_DOWN, 100f, 100f),
        Triple(MotionEvent.ACTION_MOVE, 100f, 130f),
        Triple(MotionEvent.ACTION_UP, 100f, 100f),
      ),
    )
  }

  @Test
  fun cancelledGestureIsNotATap() {
    assertEquals(0, taps(Triple(MotionEvent.ACTION_DOWN, 100f, 100f), Triple(MotionEvent.ACTION_CANCEL, 100f, 100f)))
  }

  @Test
  fun secondPointerCancelsTheTap() {
    assertEquals(
      0,
      taps(
        Triple(MotionEvent.ACTION_DOWN, 100f, 100f),
        Triple(MotionEvent.ACTION_POINTER_DOWN, 200f, 200f),
        Triple(MotionEvent.ACTION_UP, 100f, 100f),
      ),
    )
  }

  @Test
  fun upWithoutDownIsNotATap() {
    assertEquals(0, taps(Triple(MotionEvent.ACTION_UP, 100f, 100f)))
  }

  @Test
  fun consecutiveTapsAreEachReported() {
    assertEquals(
      2,
      taps(
        Triple(MotionEvent.ACTION_DOWN, 100f, 100f),
        Triple(MotionEvent.ACTION_UP, 100f, 100f),
        Triple(MotionEvent.ACTION_DOWN, 300f, 300f),
        Triple(MotionEvent.ACTION_UP, 300f, 300f),
      ),
    )
  }
}
