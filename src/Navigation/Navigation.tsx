import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Camera from '../screens/Camera';
import Library from '../screens/Library';
import CameraSVG from '../assets/film.svg';
import LibrarySVG from '../assets/list_video.svg';
import {SvgXml} from 'react-native-svg';
import theme from '../theme';

const Tab = createMaterialBottomTabNavigator();

function NavigationTabs() {
  const sizeIcon = 26;
  const nameLibrary = 'Library';
  const nameCamera = 'Camera';

  return (
    <Tab.Navigator
      initialRouteName={'Camera'}
      activeColor={theme.tabsActiveColor}
      inactiveColor={theme.tabsInactiveColor}
      barStyle={{backgroundColor: theme.tabsBackgroundColor}}>
      <Tab.Screen
        name={nameLibrary}
        component={Library}
        options={{
          tabBarLabel: nameLibrary,
          tabBarIcon: ({color}) => (
            <SvgXml
              width={sizeIcon}
              height={sizeIcon}
              xml={(LibrarySVG as SVGImageElement) as string}
              fill={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={nameCamera}
        component={Camera}
        options={{
          tabBarLabel: nameCamera,
          tabBarIcon: ({color}) => (
            <SvgXml
              width={sizeIcon}
              height={sizeIcon}
              xml={(CameraSVG as SVGImageElement) as string}
              fill={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default NavigationTabs;
