import { expect, TestScope } from 'react-native-cavynext';
import {
  PlayerEventType,
  SourceDescription,
  TextTrack,
  TextTrackEvent,
  TextTrackEventType,
  TextTrackKind,
  THEOplayer,
} from 'react-native-theoplayer';
import { preparePlayerWithSource, seekTo, waitForPlayerEvents } from '../utils/Actions';
import { sleep } from '../utils/TimeUtils';

const SIDE_LOADED_SOURCE: SourceDescription = {
  sources: {
    src: 'https://cdn.theoplayer.com/video/sintel/nosubs.m3u8',
    type: 'application/x-mpegurl',
  },
  textTracks: [
    {
      src: 'https://cdn.theoplayer.com/video/elephant/elephants-dream-subtitles-nl.vtt',
      kind: TextTrackKind.subtitles,
      srclang: 'nl',
      label: 'Dutch',
      format: 'webvtt',
    },
  ],
};

const HLS_SOURCE: SourceDescription = {
  sources: {
    src: 'https://cdn.theoplayer.com/video/tears_of_steel/index.m3u8',
    type: 'application/x-mpegurl',
  },
};

const CUE_TIMEOUT = { timeout: 30000 };

export default function (spec: TestScope) {
  spec.describe('Text tracks', () => {
    spec.it('reports active cues from a side-loaded WebVTT track', async () => {
      await expectCueEvents(spec, SIDE_LOADED_SOURCE, ['nl'], 'nl', 13e3);
    });

    spec.it('reports active cues from a WebVTT track declared by an HLS manifest', async () => {
      await expectCueEvents(spec, HLS_SOURCE, ['cn', 'de', 'en', 'fr', 'nl'], 'nl', 21e3);
    });
  });
}

async function expectCueEvents(
  spec: TestScope,
  source: SourceDescription,
  expectedLanguages: string[],
  selectedLanguage: string,
  seekTime: number,
): Promise<void> {
  const player = await preparePlayerWithSource(spec, source);
  const subtitleTracks = await waitForSubtitleTracks(player, expectedLanguages.length);
  const languages = subtitleTracks.map((track) => track.language);
  expectedLanguages.forEach((language) => expect(languages).toContain(language));

  const selectedTrack = subtitleTracks.find((track) => track.language === selectedLanguage)!;
  const cueEventsPromise = waitForPlayerEvents(
    player,
    [
      { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.ADD_CUE, trackUid: selectedTrack.uid } as Partial<TextTrackEvent>,
      { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.ENTER_CUE, trackUid: selectedTrack.uid } as Partial<TextTrackEvent>,
      { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.EXIT_CUE, trackUid: selectedTrack.uid } as Partial<TextTrackEvent>,
    ],
    false,
    CUE_TIMEOUT,
  );
  player.selectedTextTrack = selectedTrack.uid;

  await seekTo(player, seekTime);
  await cueEventsPromise;
}

// Poll `player.textTracks` until the expected number of subtitle tracks is
// available, since they populate on `loadedmetadata` rather than at source set.
async function waitForSubtitleTracks(player: THEOplayer, count: number, timeout = 30e3): Promise<TextTrack[]> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const subtitles = player.textTracks.filter((track) => track.kind === TextTrackKind.subtitles);
    if (subtitles.length >= count) {
      return subtitles;
    }
    await sleep(250);
  }
  throw new Error(
    `Timed out waiting for ${count} subtitle tracks; got ${JSON.stringify(
      player.textTracks.map(({ uid, kind, language, label, type }) => ({ uid, kind, language, label, type })),
    )}`,
  );
}
