import React from 'react';
import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import {name as appName} from './app.json';
import App from './App'; // Assuming your app component is in 'App.js'

const AppWithGestureHandler = () => (
  <GestureHandlerRootView>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => AppWithGestureHandler);