package com.theoplayer.integration

import com.facebook.react.bridge.JavaOnlyMap
import com.theoplayer.PlayerConfigAdapter
import org.junit.Assert.*
import org.junit.Test

class PlayerFacadeConfigurationTest {
  @Test fun facadeOptInDefaultsOffAndLeavesOriginalPlayerUntouched() {
    for (props in listOf(null, JavaOnlyMap(), JavaOnlyMap.of("usePlayerFacade", false), JavaOnlyMap.of("usePlayerFacade", null))) {
      val host = PlayerFacadeTestHost()
      val enabled = PlayerConfigAdapter(props).usePlayerFacade()
      assertFalse(enabled)
      assertSame(host.player, PlayerFacade.create(host.player, enabled))
      assertEquals(0, host.adsReads)
      assertTrue(host.adListeners.isEmpty())
      assertTrue(host.playerListeners.isEmpty())
    }
  }

  @Test fun optInCreatesFacadeBeforeRegistrationAndExposesContentPlayer() {
    val host = PlayerFacadeTestHost()
    val enabled = PlayerConfigAdapter(JavaOnlyMap.of("usePlayerFacade", true)).usePlayerFacade()
    assertTrue(enabled)
    val player = PlayerFacade.create(host.player, enabled) as PlayerFacade
    assertSame(host.player, player.contentPlayer)
    assertNotSame(host.player, player)
    player.close()
  }
}
