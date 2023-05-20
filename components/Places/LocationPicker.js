import { View, StyleSheet, Alert, Image, Text } from "react-native";
import OutlineButton from "../UI/OutlineButton";
import { Colors } from "../../constants/colors";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';
import { useState } from "react";
import { getMapPreview } from "../../util/location";
 
function LocationPicker(){

    const [pickedLocation, setPickedLocation] = useState();
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

    async function verifyPermissions(){
        if(locationPermissionInformation.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        if(locationPermissionInformation.status === PermissionStatus.DENIED){
            Alert.alert(
                'Insufficient Permissions',
                'You need to grant location permissions to use this app.'
            );
            return false;
        }
        return true;
    }

    async function getLocationHandler(){
        const hasPermission = await verifyPermissions();
        if(!hasPermission){
            return;
        }
        const location = await getCurrentPositionAsync();
        console.log(location);
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        });
    }

    let locationPreview = <Text>No location picked yet.</Text>

    if(pickedLocation){
        locationPreview = (
            <Image 
                source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}} 
                style={styles.image}
            />
        );
    }

    function pickOnMapHandler(){}
    return(
        <View>
            <View style={styles.mapPreview}>
                {locationPreview}
            </View>
            <View style={styles.actions}>
                <OutlineButton icon='location' onPress={getLocationHandler}>
                    Locate user
                </OutlineButton>
                <OutlineButton icon='map' onPress={pickOnMapHandler}>
                    Pick on Map
                </OutlineButton>
            </View>
        </View>
    )
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems:'center'
    },
    image:{
        width: '100%',
        height: '100%'
    }
})