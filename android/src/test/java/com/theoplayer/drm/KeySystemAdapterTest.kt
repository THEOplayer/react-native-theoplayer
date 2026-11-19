package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.KeySystemId
import org.junit.Assert.*
import org.junit.Test

class KeySystemAdapterTest {
  @Test fun parsesKeySystemAliases() {
    assertEquals(KeySystemId.WIDEVINE, KeySystemAdapter.fromString("widevine"))
    assertEquals(KeySystemId.PLAYREADY, KeySystemAdapter.fromString("playready"))
    assertEquals(KeySystemId.FAIRPLAY, KeySystemAdapter.fromString("fairplay"))
    assertEquals(KeySystemId.CLEAR_KEY, KeySystemAdapter.fromString("clearkey"))
  }

  @Test fun parsesDashIfKeySystemUrns() {
    assertEquals(KeySystemId.WIDEVINE, KeySystemAdapter.fromString("urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed"))
    assertEquals(KeySystemId.PLAYREADY, KeySystemAdapter.fromString("urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95"))
    assertEquals(KeySystemId.FAIRPLAY, KeySystemAdapter.fromString("urn:uuid:94ce86fb-07bb-4b43-adb8-93d2fa968ca2"))
    assertEquals(KeySystemId.CLEAR_KEY, KeySystemAdapter.fromString("urn:uuid:e2719d58-a985-b3c9-781a-b030af78d30e"))
  }

  @Test fun parsesKeySystemUrnsCaseInsensitively() {
    assertEquals(KeySystemId.PLAYREADY, KeySystemAdapter.fromString("URN:UUID:9A04F079-9840-4286-AB92-E65BE0885F95"))
  }

  @Test fun rejectsUnknownKeySystems() {
    assertNull(KeySystemAdapter.fromString("urn:uuid:00000000-0000-0000-0000-000000000000"))
    assertNull(KeySystemAdapter.fromString(""))
  }
}
