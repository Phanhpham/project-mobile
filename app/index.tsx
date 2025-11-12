import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native';

export default function RootIndex() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () =>{
      setLoading(true)
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored){
          setUser(JSON.parse(stored))
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser();
  }, [])

  if (loading){
    return (
      <View>
        <Text>Dang tai....</Text>
      </View>
    )
  }

  if (user) {
    return <Redirect href={"/client/room/home"}/>
  }

  return <Redirect href={"/introduce"}/>
  
}
