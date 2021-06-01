import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Camera__ from "./components/Camera___";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Camera__></Camera__>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
