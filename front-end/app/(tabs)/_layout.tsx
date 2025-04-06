import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: {
                    backgroundColor: '#F7F6EF',      // Solid background color
                    borderTopWidth: 0,            // Removes border shadow
                    height: 90,                   // Customize height
                    paddingBottom: 10,            // Adjust padding
                    paddingTop: 10,
                    position: 'absolute',

                    // android shadow
                    elevation: 4,

                    // ios shadow
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
            }}>
            <Tabs.Screen
                name="allergens" // allergens
                options={{
                    tabBarLabel: ({ focused }) => (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 35,
                                backgroundColor: focused ? '#009D7C' : 'transparent',
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                            }}
                        >
                            <Text
                                style={{
                                    color: focused ? '#fff' : '#000',
                                    fontWeight: focused ? 'bold' : 'normal',
                                    fontSize: 14,
                                }}
                            > Allergens </Text>
                        </View>
                    ),
                    tabBarIcon: () => null,
                }}
            />
            <Tabs.Screen
                name="home" // scan
                options={{
                    tabBarLabel: ({ focused }) => (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 35,
                                backgroundColor: focused ? '#009D7C' : 'transparent',
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                            }}
                        >
                            <Text
                                style={{
                                    color: focused ? '#fff' : '#000',
                                    fontWeight: focused ? 'bold' : 'normal',
                                    fontSize: 14,
                                }}
                            > Scan </Text>
                        </View>
                    ),
                    tabBarIcon: () => null,
                }}
            />
            {/*<Tabs.Screen*/}
            {/*    name="explore" // allergens*/}
            {/*    options={{*/}
            {/*        tabBarLabel: ({ focused }) => (*/}
            {/*            <View*/}
            {/*                style={{*/}
            {/*                    position: 'absolute',*/}
            {/*                    bottom: 14,*/}
            {/*                    backgroundColor: focused ? '#009D7C' : 'transparent',*/}
            {/*                    paddingVertical: 8,*/}
            {/*                    paddingHorizontal: 16,*/}
            {/*                    borderRadius: 12,*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <Text*/}
            {/*                    style={{*/}
            {/*                        color: focused ? '#fff' : '#000',*/}
            {/*                        fontWeight: focused ? 'bold' : 'normal',*/}
            {/*                        fontSize: 14,*/}
            {/*                    }}*/}
            {/*                > Explore </Text>*/}
            {/*            </View>*/}
            {/*        ),*/}
            {/*        tabBarIcon: () => null,*/}
            {/*    }}*/}
            {/*/>*/}
        </Tabs>
    );
}
