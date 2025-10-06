package com.theoplayer.track

import android.graphics.Color
import android.graphics.Typeface
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.player.track.texttrack.TextTrackStyle

private const val PROP_BACKGROUND_COLOR = "backgroundColor"
private const val PROP_EDGE_STYLE = "edgeStyle"
private const val PROP_EDGE_COLOR = "edgeColor"
private const val PROP_FONT_COLOR = "fontColor"
private const val PROP_FONT_FAMILY = "fontFamily"
private const val PROP_FONT_SIZE = "fontSize"
private const val PROP_FONT_PATH = "fontPath"
private const val PROP_WINDOW_COLOR = "windowColor"
private const val PROP_MARGIN_LEFT = "marginLeft"
private const val PROP_MARGIN_RIGHT = "marginRight"
private const val PROP_MARGIN_TOP = "marginTop"
private const val PROP_MARGIN_BOTTOM = "marginBottom"
private const val PROP_COLOR_R = "r"
private const val PROP_COLOR_G = "g"
private const val PROP_COLOR_B = "b"
private const val PROP_COLOR_A = "a"

object TextTrackStyleAdapter {

  fun applyTextTrackStyle(style: TextTrackStyle, context: ReactApplicationContext, props: ReadableMap?) {
    if (props == null) {
      return
    }
    if (props.hasKey(PROP_BACKGROUND_COLOR)) {
      style.backgroundColor =
        colorFromBridgeColor(props.getMap(PROP_BACKGROUND_COLOR)) ?: Color.BLACK
    }
    if (props.hasKey(PROP_EDGE_STYLE)) {
      style.edgeType = edgeStyleFromProps(props.getString(PROP_EDGE_STYLE))
    }
    if (props.hasKey(PROP_EDGE_COLOR)) {
      style.edgeColor = colorFromBridgeColor(props.getMap(PROP_EDGE_COLOR)) ?: Color.WHITE
    }
    if (props.hasKey(PROP_FONT_COLOR)) {
      style.fontColor = colorFromBridgeColor(props.getMap(PROP_FONT_COLOR)) ?: Color.WHITE
    }
    if (props.hasKey(PROP_FONT_FAMILY)) {
      val family = props.getString(PROP_FONT_FAMILY)
      if (family != null) {
        style.setFont(family, TextTrackStyle.FontStyle.NORMAL)
      } else {
        style.setFont(TextTrackStyle.FontFamily.DEFAULT, TextTrackStyle.FontStyle.NORMAL)
      }
    }
    if (props.hasKey(PROP_FONT_SIZE)) {
      style.fontSize = props.getInt(PROP_FONT_SIZE)
    }
    if (props.hasKey(PROP_WINDOW_COLOR)) {
      style.windowColor = colorFromBridgeColor(props.getMap(PROP_WINDOW_COLOR)) ?: Color.TRANSPARENT
    }
    if (props.hasKey(PROP_MARGIN_TOP)) {
      style.marginTop = props.getInt(PROP_MARGIN_TOP)
    }
    if (props.hasKey(PROP_MARGIN_BOTTOM)) {
      style.marginBottom = props.getInt(PROP_MARGIN_BOTTOM)
    }
    if (props.hasKey(PROP_MARGIN_LEFT)) {
      style.marginLeft = props.getInt(PROP_MARGIN_LEFT)
    }
    if (props.hasKey(PROP_MARGIN_RIGHT)) {
      style.marginRight = props.getInt(PROP_MARGIN_RIGHT)
    }
    if (props.hasKey(PROP_FONT_PATH)) {
      val font = Typeface.createFromAsset(context.assets, props.getString(PROP_FONT_PATH))
      style.font = font
    }
  }

  private fun edgeStyleFromProps(style: String?): TextTrackStyle.EdgeType {
    return when (style) {
      "dropshadow" -> TextTrackStyle.EdgeType.EDGE_TYPE_DROP_SHADOW
      "raised" -> TextTrackStyle.EdgeType.EDGE_TYPE_RAISED
      "depressed" -> TextTrackStyle.EdgeType.EDGE_TYPE_DEPRESSED
      "uniform" -> TextTrackStyle.EdgeType.EDGE_TYPE_OUTLINE
      else -> TextTrackStyle.EdgeType.EDGE_TYPE_NONE
    }
  }

  private fun colorFromBridgeColor(color: ReadableMap?): Int? {
    if (color == null) {
      return null
    }
    return Color.argb(
      color.getInt(PROP_COLOR_A),
      color.getInt(PROP_COLOR_R),
      color.getInt(PROP_COLOR_G),
      color.getInt(PROP_COLOR_B),
    )
  }
}
