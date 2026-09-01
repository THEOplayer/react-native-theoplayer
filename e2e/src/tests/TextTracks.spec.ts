import { expect, TestScope } from 'react-native-cavynext';
import { PlayerEventType, TextTrack, TextTrackEvent, TextTrackEventType, TextTrackKind, THEOplayer } from 'react-native-theoplayer';
import mp4 from '../res/mp4.json';
import { preparePlayerWithSource, seekTo, waitForPlayerEvents } from '../utils/Actions';
import { sleep } from '../utils/TimeUtils';

// Side-load the Elephants Dream WebVTT tracks on the matching MP4 source.
// The first cue starts around 15s.
const SUBTITLE_SOURCE = {
  ...mp4[0],
  sources: {
    ...mp4[0].sources,
    src: 'https://cdn.theoplayer.com/video/elephants-dream.mp4',
  },
  textTracks: [
    {
      src: 'https://cdn.theoplayer.com/video/elephant/elephants-dream-subtitles-en.vtt',
      kind: TextTrackKind.subtitles,
      srclang: 'en',
      label: 'English',
      format: 'webvtt',
    },
    {
      src: 'https://cdn.theoplayer.com/video/elephant/elephants-dream-subtitles-nl.vtt',
      kind: TextTrackKind.subtitles,
      srclang: 'nl',
      label: 'Dutch',
      format: 'webvtt',
    },
  ],
};

const EXPECTED_LANGUAGES = ['en', 'nl'];
// Seek just before the first cue so playback crosses a full cue (enter + exit)
// quickly instead of waiting from the start.
const SEEK_TIME = 13e3;
// Reaching and crossing a cue is quick, but leave room for buffering on CI.
const CUE_TIMEOUT = { timeout: 30000 };

export default function (spec: TestScope) {
  spec.describe('Text tracks', () => {
    spec.it('reports active cues while playing a selected subtitle track', async () => {
      const player = await preparePlayerWithSource(spec, SUBTITLE_SOURCE);

      // Tracks appear on `loadedmetadata`, which can trail the `playing` event.
      const subtitleTracks = await waitForSubtitleTracks(player, EXPECTED_LANGUAGES.length);

      // Both expected subtitle languages are present.
      const languages = subtitleTracks.map((track) => track.language);
      EXPECTED_LANGUAGES.forEach((language) => expect(languages).toContain(language));

      // Select the Dutch track; `showing` mode makes its cues active and fires
      // cue events as playback crosses them.
      const dutch = subtitleTracks.find((track) => track.language === 'nl')!;

      // A cue must be added, then become active and inactive at least once as
      // playback crosses it: expect an `addcue`, an `entercue` and an `exitcue`
      // for this track.
      const cueEventsPromise = waitForPlayerEvents(
        player,
        [
          { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.ADD_CUE, trackUid: dutch.uid } as Partial<TextTrackEvent>,
          { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.ENTER_CUE, trackUid: dutch.uid } as Partial<TextTrackEvent>,
          { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.EXIT_CUE, trackUid: dutch.uid } as Partial<TextTrackEvent>,
        ],
        false,
        CUE_TIMEOUT,
      );
      player.selectedTextTrack = dutch.uid;

      // Seek just before the first cue and let autoplay carry playback across it.
      await seekTo(player, SEEK_TIME);
      await cueEventsPromise;
    });
  });
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
  throw new Error(`Timed out waiting for ${count} subtitle tracks; got ${player.textTracks.length} text tracks`);
}
