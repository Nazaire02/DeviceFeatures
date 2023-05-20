import { View, Button, Alert, Image, Text, StyleSheet } from "react-native";
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlineButton from "../UI/OutlineButton";

function ImagePicker(){

    const [cameraPermissionInofrmation, requestPermission] = useCameraPermissions();
    const [pickedImage, setPickedImage] = useState();

    async function verifyPermissions(){
        if(cameraPermissionInofrmation.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        if(cameraPermissionInofrmation.status === PermissionStatus.DENIED){
            Alert.alert(
                'Insufficient Permissions',
                'You need to grant camera permissions to use this app.'
            );
            return false;
        }
        return true;
    }

    async function takeImageHandler(){
        const hasPermission = await verifyPermissions();
        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });

        setPickedImage(image.uri);
    }

    let imagePreview = <Text>No image taken yet</Text>

    if(pickedImage){
        imagePreview = <Image source={{uri: pickedImage}} style = {styles.image}/>
    }
    return(
        <View>
            <View style={styles.imagePreview}>
                {imagePreview}
            </View>
            <OutlineButton icon="camera" onPress={takeImageHandler}>Take Image</OutlineButton>
        </View>
    )
}

export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    image:{
        height: '100%',
        width: '100%'
    }
})