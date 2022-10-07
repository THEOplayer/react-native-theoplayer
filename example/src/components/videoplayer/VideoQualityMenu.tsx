import { SettingsIcon } from '../../res/images';
import { MenuItem } from '../modalmenu/MenuItem';
import type { VideoQuality } from 'react-native-theoplayer';
import { MenuButton } from '../menubutton/MenuButton';
import React from 'react';
import { findMediaTrackByUid, MediaTrack } from 'react-native-theoplayer';

export interface VideoQualityMenuProps {
  videoTracks: MediaTrack[];
  selectedVideoTrack: number | undefined;
  targetVideoTrackQuality: number | number[] | undefined;
  onSelectTargetVideoQuality?: (uid: number | number[] | undefined) => void;
}

function getQualityLabel(quality: VideoQuality | undefined): string {
  if (!quality) {
    return 'auto';
  }
  if (quality.label && quality.label !== '') {
    return quality.label;
  }
  let label = '';
  if (quality.height) {
    label = quality.height + 'p';
  }
  if (!quality.bandwidth) {
    return label;
  }
  let bandwidth;
  if (quality.bandwidth > 1e7) {
    bandwidth = (quality.bandwidth / 1e6).toFixed(0) + 'Mbps';
  } else if (quality.bandwidth > 1e6) {
    bandwidth = (quality.bandwidth / 1e6).toFixed(1) + 'Mbps';
  } else {
    bandwidth = (quality.bandwidth / 1e3).toFixed(0) + 'kbps';
  }
  const isHD = quality.height ? quality.height >= 720 : false;
  return `${label} - ${bandwidth} ${isHD ? '(HD)' : ''}`;
}

export function VideoQualityMenu(props: VideoQualityMenuProps) {
  const { videoTracks, selectedVideoTrack, targetVideoTrackQuality, onSelectTargetVideoQuality } = props;

  const availableVideoQualities = findMediaTrackByUid(videoTracks, selectedVideoTrack)?.qualities || [];
  if (!availableVideoQualities || availableVideoQualities.length === 0) {
    return <></>;
  }

  const selectTargetVideoQuality = (qualityIndex: number | undefined) => {
    if (onSelectTargetVideoQuality) {
      if (!videoTracks || !selectedVideoTrack) {
        return;
      }
      const videoTrack = videoTracks.find((track) => track.uid === selectedVideoTrack);
      const qualities = videoTrack?.qualities;
      if (!qualities) {
        return;
      }
      if (qualityIndex && qualityIndex >= 0 && qualityIndex < qualities.length) {
        onSelectTargetVideoQuality(qualities[qualityIndex].uid);
      } else {
        // deselect target quality
        onSelectTargetVideoQuality(undefined);
      }
    }
  };

  return (
    <MenuButton
      title={'Quality'}
      icon={SettingsIcon}
      data={[...availableVideoQualities, undefined].map((q) => new MenuItem(getQualityLabel(q as VideoQuality))).sort()}
      onItemSelected={selectTargetVideoQuality}
      minimumItems={2}
      selectedItem={
        targetVideoTrackQuality
          ? availableVideoQualities.findIndex((quality) => quality.uid === targetVideoTrackQuality)
          : availableVideoQualities.length
      }
      keyExtractor={(index: number) => `vq${index}`}
    />
  );
}
