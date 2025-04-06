import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { background } from '@/constants/Colors';

export default function HomeScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing}>
                <View style={styles.topRightCorner} />
                <View style={styles.bottomLeftCorner} />
                <View style={styles.topLeftCorner} />
                <View style={styles.bottomRightCorner} />
                {/*<View style = {styles.footer} />*/}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>

    );
}

const BORDER_THICKNESS = 3;
const CORNER_SIZE = 50; // Size of the corner squares

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 70,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    topRightCorner: {
        position: 'absolute',
        top: '30%',
        right: '15%',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderColor: 'white',
        borderTopRightRadius: 25,
    },
    topLeftCorner: {
        position: 'absolute',
        top: '30%',
        left: '15%',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderTopWidth:BORDER_THICKNESS,
        borderLeftWidth: BORDER_THICKNESS,
        borderColor: 'white',
        borderTopLeftRadius: 25,
    },
    bottomLeftCorner: {
        position: 'absolute',
        bottom: '30%',
        left: '15%',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderBottomWidth:BORDER_THICKNESS,
        borderLeftWidth: BORDER_THICKNESS,
        borderColor: 'white',
        borderBottomLeftRadius: 25,
    },
    bottomRightCorner: {
        position: 'absolute',
        bottom: '30%',
        right: '15%',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderBottomWidth:BORDER_THICKNESS,
        borderRightWidth: BORDER_THICKNESS,
        borderColor: 'white',
        borderBottomRightRadius: 25,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80, // adjust height as needed
        backgroundColor: "#fbfbfa",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        zIndex: 15,
    },
});

