import { expect, TestScope } from 'react-native-cavynext';
import { PlayerEventType, TextTrack, TextTrackEvent, TextTrackEventType, TextTrackKind, THEOplayer } from 'react-native-theoplayer';
import hls from '../res/hls.json';
import { preparePlayerWithSource, seekTo, waitForPlayerEvents } from '../utils/Actions';
import { sleep } from '../utils/TimeUtils';

// The elephants-dream single-audio HLS stream carries two TTML subtitle
// tracks: Chinese (zh) and French (fr). Its first cue starts around 15s.
const SUBTITLE_SOURCE = hls.find((source) => JSON.stringify(source.sources).includes('elephants-dream'))!;

const EXPECTED_LANGUAGES = ['zh', 'fr'];
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

      // Select the French track; `showing` mode makes its cues active and fires
      // cue events as playback crosses them.
      const french = subtitleTracks.find((track) => track.language === 'fr')!;

      // A cue must be added, then become active and inactive at least once as
      // playback crosses it: expect an `addcue`, an `entercue` and an `exitcue`
      // for this track.
      const cueEventsPromise = waitForPlayerEvents(
        player,
        [
          { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.ADD_CUE, trackUid: french.uid } as Partial<TextTrackEvent>,
          { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.ENTER_CUE, trackUid: french.uid } as Partial<TextTrackEvent>,
          { type: PlayerEventType.TEXT_TRACK, subType: TextTrackEventType.EXIT_CUE, trackUid: french.uid } as Partial<TextTrackEvent>,
        ],
        false,
        CUE_TIMEOUT,
      );
      player.selectedTextTrack = french.uid;

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
