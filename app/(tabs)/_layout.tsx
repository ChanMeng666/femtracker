import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { brandTheme } from '../theme';

export default function TabLayout() {
    const { brandColors } = brandTheme;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: brandColors.primary.main,
                tabBarInactiveTintColor: brandColors.text.secondary,
                tabBarStyle: {
                    backgroundColor: brandColors.background.elevated,
                    borderTopColor: brandColors.divider,
                    borderTopWidth: 1,
                },
                tabBarLabelStyle: {
                    ...brandTheme.typography.labelMedium,
                },
                headerStyle: {
                    backgroundColor: brandColors.background.elevated,
                    borderBottomColor: brandColors.divider,
                    borderBottomWidth: 1,
                },
                headerTitleStyle: {
                    ...brandTheme.typography.titleMedium,
                    color: brandColors.text.primary,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: '记录',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="plus-circle"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: '查看',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
