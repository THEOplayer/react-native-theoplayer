import { withDangerousMod } from '@expo/config-plugins';
import fs from 'fs';
import path from 'path';

/**
 * Add a custom pod-line to Podfile.
 */
function addPodToPodfile(contents: string, podLine: string) {
  const lines = contents.split('\n');
  const targetIndex = lines.findIndex((line: string) => line.trim().startsWith("target '")) + 1;
  if (targetIndex > 0 && !lines.includes(podLine)) {
    lines.splice(targetIndex, 0, podLine);
  }
  return lines.join('\n');
}

export const withCustomPod = (config: any, podLine: string) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.projectRoot, 'ios', 'Podfile');
      const contents = fs.readFileSync(podfilePath, 'utf8');
      const newContents = addPodToPodfile(contents, podLine);
      fs.writeFileSync(podfilePath, newContents);
      return config;
    },
  ]);
};
