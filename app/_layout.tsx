import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { brandTheme } from './theme';

// Decorative background pattern component inspired by the logo
const BackgroundPattern: React.FC = () => {
    const { brandColors } = brandTheme;

    return (
        <View style={styles.patternContainer}>
            {/* Top decorative curves */}
            <View style={styles.topPattern}>
                <LinearGradient
                    colors={brandColors.primary.gradient}
                    style={styles.gradientCurve}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </View>

            {/* Bottom decorative lines */}
            <View style={styles.bottomPattern}>
                <View style={[styles.line, { backgroundColor: brandColors.secondary.light }]} />
                <View style={[styles.line, { backgroundColor: brandColors.secondary.main }]} />
                <View style={[styles.line, { backgroundColor: brandColors.secondary.dark }]} />
            </View>
        </View>
    );
};

export default function RootLayout() {
    return (
        <PaperProvider theme={brandTheme}>
            <View style={styles.container}>
                <BackgroundPattern />
                <View style={styles.content}>
                    <Slot />
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brandTheme.colors.background,
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
    patternContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    topPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        overflow: 'hidden',
    },
    gradientCurve: {
        position: 'absolute',
        top: -100,
        left: -50,
        right: -50,
        height: 200,
        borderRadius: 100,
        transform: [{ scaleX: 1.5 }],
        opacity: 0.1,
    },
    bottomPattern: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        opacity: 0.1,
    },
    line: {
        height: 2,
        marginBottom: 8,
        marginHorizontal: 16,
    },
});
