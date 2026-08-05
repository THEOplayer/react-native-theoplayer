import { AppRegistry } from 'react-native';
import { TestableApp } from './src/TestableApp';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => TestableApp);

// On web the application has to be started explicitly.
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('app'),
});
