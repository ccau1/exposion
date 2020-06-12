import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import store from '../redux/store';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
