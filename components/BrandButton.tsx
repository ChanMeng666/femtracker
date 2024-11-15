import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { brandTheme } from '@/app/theme';

interface BrandButtonProps {
    onPress: () => void;
    title: string;
    mode?: 'primary' | 'secondary';
    disabled?: boolean;
    style?: any;
}

export const BrandButton: React.FC<BrandButtonProps> = ({
                                                            onPress,
                                                            title,
                                                            mode = 'primary',
                                                            disabled = false,
                                                            style
                                                        }) => {
    const { brandColors, shape } = brandTheme;

    const gradientColors = mode === 'primary'
        ? brandColors.primary.gradient
        : [brandColors.secondary.light, brandColors.secondary.main];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, style]}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.gradient,
                    { opacity: disabled ? 0.5 : 1 }
                ]}
            >
                <View style={styles.decorationLeft} />
                <View style={styles.decorationRight} />

                <Text
                    style={[
                        styles.text,
                        { color: mode === 'primary' ? '#FFFFFF' : brandColors.text.primary }
                    ]}
                >
                    {title.toUpperCase()}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: brandTheme.shape.buttonHeight,
        borderRadius: brandTheme.shape.borderRadius,
        overflow: 'hidden',
        ...brandTheme.globalStyles.shadow,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: brandTheme.shape.spacing * 3,
    },
    text: {
        ...brandTheme.typography.labelMedium,
        fontWeight: '600',
    },
    decorationLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    decorationRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
});
