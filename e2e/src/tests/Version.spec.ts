import { expect, TestScope } from 'react-native-cavynext';
import { sdkVersions } from 'react-native-theoplayer';

export default function (spec: TestScope) {
  spec.describe('Query SDK version info', () => {
    spec.it('returns correct React Native and native SDK versions.', async () => {
      const versions = await sdkVersions();
      expect(versions.rn).toBeDefined();
      expect(versions.rn.length).toBeGreaterThan(0);
      expect(versions.native).toBeDefined();
      expect(versions.native?.length).toBeGreaterThan(0);
    });
  });
}
