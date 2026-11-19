import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EnderecosProvider } from './src/context/EnderecosContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <SafeAreaProvider><EnderecosProvider><AppNavigator /></EnderecosProvider></SafeAreaProvider>;
}
