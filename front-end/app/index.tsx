import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
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
    );
};

const styles = {
    Text: {
        fontSize: 20,
        color: 'black',
    }
}
