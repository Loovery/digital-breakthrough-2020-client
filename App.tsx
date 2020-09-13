import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import NavigationTabs from './src/Navigation/Navigation';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Provider} from 'react-redux';
import {store} from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{backgroundColor: '#3f0e34'}} />
      <NavigationContainer>
        <NavigationTabs />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
