import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SwipeCalendar from './src/SwipeCalendar';

const App = () => {
  return (
    <View style={{backgroundColor:'black'}}>
      <SwipeCalendar />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
