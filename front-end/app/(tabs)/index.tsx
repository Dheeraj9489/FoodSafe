import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { uploadImage } from '@/constants/api'; // Adjust the import path as necessary
//import { background } from '@/constants/Colors';

export default function HomeScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);

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

    // function toggleCameraFacing() {
    //     setFacing(current => (current === 'back' ? 'front' : 'back'));
    // }
    console.log("Works");

    const takePicture = async () => {
        console.log('Taking picture...');
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            if (!photo) {
                console.error('Failed to take picture');
                return;
            }
            console.log('Photo URI:', photo.uri);

            try {
                const result = await uploadImage(photo.uri);
                console.log('Upload result:', result);
                // You can now use the returned JSON (e.g., display a message or store info)
            } catch (error) {
                console.error('Upload failed:', error);
            }
            console.log('Reached');
        } else {
            console.log('Camera ref is null');
        }
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.topRightCorner} />
                <View style={styles.bottomLeftCorner} />
                <View style={styles.topLeftCorner} />
                <View style={styles.bottomRightCorner} />
                {/*<View style = {styles.footer} />*/}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
                        <View style={styles.outerCircle}>
                            <View style={styles.innerCircle} />
                        </View>
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
        justifyContent: 'flex-end',
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
        marginTop: 750,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparant',
        margin: 15,
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
    shutterButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
      },
      outerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // 20% opacity white
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },
      innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
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

