import { Tabs } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#A7A9BE',
        tabBarStyle: {
          backgroundColor: '#0F0E17',
          borderTopColor: '#242132',
          height: 65,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={require('../../assets/images/dashboard-icon.png')} 
              style={[styles.tabIcon, { tintColor: color, opacity: focused ? 1 : 0.6 }]} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={require('../../assets/images/analytics-icon.png')} 
              style={[styles.tabIcon, { tintColor: color, opacity: focused ? 1 : 0.6 }]} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});