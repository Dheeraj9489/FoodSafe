import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function WelcomeScreen() {
    const router = useRouter();
    // console.log('WelcomeScreen');
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Welcome Message</Text>
                <Text>Welcome Message</Text>
                <Text>Welcome Message</Text>
                <Text>Welcome Message</Text>

                <Text>Welcome Message</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                    <Text>Get Started</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = {
    Text: {
        fontSize: 20,
        color: 'black',
    }
}
