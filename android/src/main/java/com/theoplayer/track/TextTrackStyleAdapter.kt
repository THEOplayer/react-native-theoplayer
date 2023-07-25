package com.theoplayer.track

import android.graphics.Color
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.player.track.texttrack.TextTrackStyle

private val PROP_BACKGROUND_COLOR = "backgroundColor"
private val PROP_EDGE_STYLE = "edgeStyle"
private val PROP_FONT_COLOR = "fontColor"
private val PROP_FONT_FAMILY = "fontFamily"
private val PROP_FONT_SIZE = "fontSize"
private val PROP_WINDOW_COLOR = "windowColor"
private val PROP_MARGIN_LEFT = "marginLeft"
private val PROP_MARGIN_TOP = "marginTop"
private val PROP_COLOR_R = "r"
private val PROP_COLOR_G = "g"
private val PROP_COLOR_B = "b"
private val PROP_COLOR_A = "a"

object TextTrackStyleAdapter {

  fun applyTextTrackStyle(style: TextTrackStyle, props: ReadableMap?) {
    if (props == null) {
      return
    }

    props.getMap(PROP_BACKGROUND_COLOR)?.let { color ->
      style.backgroundColor = colorFromBridgeColor(color)
    }
    if (props.hasKey(PROP_EDGE_STYLE)) {
      style.edgeType = edgeStyleFromProps(props.getString(PROP_EDGE_STYLE))
    }
    props.getMap(PROP_FONT_COLOR)?.let { color ->
      style.fontColor = colorFromBridgeColor(color)
    }
    props.getString(PROP_FONT_FAMILY)?.let { family ->
      style.setFont(family, TextTrackStyle.FontStyle.NORMAL)
    }
    if (props.hasKey(PROP_FONT_SIZE)) {
      style.fontSize = props.getInt(PROP_FONT_SIZE)
    }
    props.getMap(PROP_WINDOW_COLOR)?.let { color ->
      style.windowColor = colorFromBridgeColor(color)
    }
    if (props.hasKey(PROP_MARGIN_TOP)) {
      style.marginTop = props.getInt(PROP_MARGIN_TOP)
    }
    if (props.hasKey(PROP_MARGIN_LEFT)) {
      style.marginLeft = props.getInt(PROP_MARGIN_LEFT)
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

  private fun colorFromBridgeColor(color: ReadableMap): Int {
    return Color.argb(
      color.getInt(PROP_COLOR_A),
      color.getInt(PROP_COLOR_R),
      color.getInt(PROP_COLOR_G),
      color.getInt(PROP_COLOR_B),
    )
  }

  private fun fontSizeFromPercentage(size: String?): Int {
    if (size == null) {
      return 100
    }
    val numberString = size.replace("%", "")
    return numberString.toInt()
  }
}
