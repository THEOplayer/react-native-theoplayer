import { TestScope } from 'cavy';
import { sdkVersions } from 'react-native-theoplayer';
import { expect } from '../utils/Actions';
import { Log } from '../utils/Log';

export default function (spec: TestScope) {
  const specDescription = 'Query SDK version info';
  spec.describe(specDescription, function () {
    const itDescription = 'returns correct React Native and native SDK versions.';
    spec.it(itDescription, async function () {
      Log.debug(`### START TEST ###: ${specDescription} - ${itDescription}`);
      const versions = await sdkVersions();
      expect(versions.rn.length).toBeTruthy();
      expect(versions.native?.length).toBeTruthy();
      Log.debug(`### END TEST ###: ${specDescription} - ${itDescription}`);
    });
  });
}
