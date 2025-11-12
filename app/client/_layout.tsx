import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: '#ddd' },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name='room'
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='booking'
        options={{
          title: "Đặt phòng",
          tabBarIcon: ({ color }) => (
            <Ionicons name="clipboard-outline" size={28} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color}/>
          ),
        }}
      />
    </Tabs>
  )
}