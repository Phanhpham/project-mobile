import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

type LoadingProps = {
  loading: boolean;
};

const Loading = ({ loading }: LoadingProps) => {
  const fadeAnim = useRef(new Animated.Value(5)).current;

  useEffect(() => {
    if (!loading) return;

    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    loopAnimation.start();

    return () => {
      loopAnimation.stop();
    };
  }, [fadeAnim, loading]);

  if (!loading) return null;

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.overlay]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <ActivityIndicator size="large" color="#FFC116" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
  },
});

export default Loading;
