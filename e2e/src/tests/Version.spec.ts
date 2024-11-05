import { TestScope } from 'cavy';
import { sdkVersions } from 'react-native-theoplayer';
import { expect } from '../utils/Actions';

export default function (spec: TestScope) {
  spec.describe('Query SDK version info', function () {
    spec.it('returns correct React Native and native SDK versions.', async function () {
      const versions = await sdkVersions();
      expect(versions.rn.length).toBeTruthy();
      expect(versions.native?.length).toBeTruthy();
    });
  });
}
