// App.js
import React from 'react';
import { SafeAreaView } from 'react-native';
import Signup from './components/Signup';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Signup />
    </SafeAreaView>
  );
};

export default App;
