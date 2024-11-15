import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: '记录',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="plus-circle" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: '查看',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="clock-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
