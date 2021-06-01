import { Camera } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";

import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";

import * as Permissions from "expo-permissions";

import * as MediaLibrary from "expo-media-library";

import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useDispatch, useSelector } from "react-redux";
// import { imageCurrentChoose } from "../slice/imageCurrentChoose";

function Camera__() {
  // const dispatch = useDispatch();
  // let history = useHistory();

  const camRef = useRef<object | any>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [capturedPhoto, setCapturedPhoto] = useState<string | any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [cancel, setCancel] = useState<boolean>(false);
  const [arrPictures, setArrPictures] = useState<Array<string>>([]);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

      setHasPermission(status === "granted");
    })();
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setOpen(true);
      setCapturedPhoto(data.uri);
      console.log(data);
    }
  }
  async function takePictureAuto() {
    var width = 0;
    setCancel(true);
    var id = setInterval(frame, 2000);
    let arr: Array<string> = [];
    async function frame() {
      if (width == 20) {
        setCancel(false);
        clearInterval(id);
        setArrPictures(arr);
        console.log(arr);
      } else {
        width++;
        if (camRef) {
          const data = await camRef.current.takePictureAsync();
          setOpen(true);
          setCapturedPhoto(data.uri);
          const asset = await MediaLibrary.createAssetAsync(data.uri);
          arr.push(data.uri);

          console.log(data);

          // console.log("asset" + asset);
        }
      }
    }
  }
  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      // const action = imageCurrentChoose({ img: result.uri });
      // di spatch(action);
      // history.push({ pathname: "/home", state: result.uri });
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        Alert.alert("Saved Picture", "Do you want change your picture?", [
          {
            text: "Cancel",

            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      })
      .catch((error: any) => {
        console.log("err", error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "center" }}
          onPress={() =>
            setFlash(
              flash === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            )
          }
        >
          {flash === Camera.Constants.FlashMode.off && (
            <Ionicons name="flash-off" size={24} color="black" />
          )}
          {flash === Camera.Constants.FlashMode.on && (
            <Ionicons name="flash" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <Camera
        style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
        type={type}
        ref={camRef}
        flashMode={flash}

        // fixOrientation={true}
        // autoFocus={true}
      >
        <TouchableOpacity
          onPress={takePictureAuto}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <MaterialCommunityIcons
            name="camera-enhance"
            size={40}
            color="white"
          />
          <Text style={{ color: "white" }}>Auto</Text>
        </TouchableOpacity>
      </Camera>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Ionicons name="ios-camera-reverse" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture} style={{ padding: 20 }}>
          <FontAwesome name="camera" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={{ padding: 20 }}>
          <Fontisto name="picture" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => setOpen(false)}
              >
                <FontAwesome5 name="window-close" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ margin: 10, paddingLeft: 100 }}
                onPress={savePicture}
              >
                <FontAwesome name="save" size={30} color="black" />
              </TouchableOpacity>
            </View>

            <Image
              style={{ resizeMode: "cover", width: "100%", height: "90%" }}
              source={{ uri: capturedPhoto }}
            />
            {cancel && (
              <Modal animationType="fade" transparent={true} visible={cancel}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 20,
                  }}
                >
                  <Text style={{ color: "white" }}>Taking pictures...</Text>
                  <ActivityIndicator size="large" />
                  <TouchableOpacity
                    onPress={() => {
                      setCancel(false);
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 30 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

export default Camera__;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
