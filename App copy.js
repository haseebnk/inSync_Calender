import React, { memo } from 'react';
import { SafeAreaView, View } from 'react-native';
import SwipeCalendar from './src/SwipeCalendar';
import { AppProvider } from './src/context/AppContext';
export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <AppContent />
      </SafeAreaView>
    </AppProvider>
  );
}

const AppContent = memo(() => {
  return (
    <View style={{backgroundColor:'black'}}>
      <SwipeCalendar />
    </View>
  );
});