import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index' options={{title:"dang ky"}}/>
        <Stack.Screen name='login' options={{title:"dang nhap"}}/>
        <Stack.Screen name='forgotPass' options={{title:"quen mat khau"}}/>
        <Stack.Screen name='verifyOTP' options={{title:"xac thuc otp"}}/>
        <Stack.Screen name='resetPassword' options={{title:" mat khau moi "}}/>
    </Stack>
  )
}
