import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import React from 'react';

AppRegistry.registerComponent(appName, () => () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
));
