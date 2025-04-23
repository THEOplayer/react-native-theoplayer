import { AppRegistry } from 'react-native';
import { TestableApp } from './src/TestableApp';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => TestableApp);
