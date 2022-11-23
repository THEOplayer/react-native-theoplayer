package com.theoplayer.drm

import com.theoplayer.android.api.contentprotection.RequestMethod

object RequestMethodAdapter {
  fun fromString(requestMethod: String?): RequestMethod {
    return when (requestMethod?.lowercase()) {
      "get" -> RequestMethod.GET
      "post" -> RequestMethod.POST
      "put" -> RequestMethod.PUT
      "delete" -> RequestMethod.DELETE
      "head" -> RequestMethod.HEAD
      "options" -> RequestMethod.OPTIONS
      else -> RequestMethod.GET
    }
  }

  fun toString(requestMethod: RequestMethod): String {
    return when (requestMethod) {
      RequestMethod.GET -> "get"
      RequestMethod.POST -> "post"
      RequestMethod.PUT -> "put"
      RequestMethod.DELETE -> "delete"
      RequestMethod.HEAD -> "head"
      RequestMethod.OPTIONS -> "options"
    }
  }
}
