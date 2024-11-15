import { MD3LightTheme } from 'react-native-paper';

export interface BrandColors {
    primary: {
        main: string;
        light: string;
        dark: string;
        gradient: string[];
    };
    secondary: {
        main: string;
        light: string;
        dark: string;
    };
    background: {
        default: string;
        paper: string;
        elevated: string;
    };
    text: {
        primary: string;
        secondary: string;
        disabled: string;
    };
    status: {
        warning: string;
        error: string;
        success: string;
    };
    divider: string;
}

// Brand colors derived from the logo
export const brandColors: BrandColors = {
    primary: {
        main: '#FF4B6E',     // Bright pink-red from logo
        light: '#FF8DA3',    // Lighter shade
        dark: '#D63D5C',     // Darker shade
        gradient: ['#FF4B6E', '#FF8DA3'] // Gradient colors
    },
    secondary: {
        main: '#FFB6C8',     // Soft pink from logo layers
        light: '#FFD9E4',
        dark: '#FF94AF'
    },
    background: {
        default: '#FFFFFF',   // White
        paper: '#FAFAFA',    // Slightly off-white for cards
        elevated: '#FFFFFF'   // Pure white for elevated surfaces
    },
    text: {
        primary: '#1A1A1A',   // Near-black for better readability
        secondary: '#757575', // Medium gray
        disabled: '#9E9E9E'   // Light gray
    },
    status: {
        warning: '#FFA726',   // Orange
        error: '#EF5350',     // Red
        success: '#66BB6A'    // Green
    },
    divider: 'rgba(0, 0, 0, 0.12)'
};

// Typography styles inspired by the Art Deco logo
export const typography = {
    displayLarge: {
        fontFamily: 'System',
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    titleLarge: {
        fontFamily: 'System',
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    titleMedium: {
        fontFamily: 'System',
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 0.15
    },
    bodyLarge: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.15
    },
    bodyMedium: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.25
    },
    labelLarge: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    labelMedium: {
        fontFamily: 'System',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    }
};

// Shapes and dimensions
export const shape = {
    borderRadius: 12,
    spacing: 8,
    buttonHeight: 48,
    cardElevation: 2
};

// Component-specific styles
export const components = {
    card: {
        elevation: shape.cardElevation,
        borderRadius: shape.borderRadius,
        paddingHorizontal: shape.spacing * 2,
        paddingVertical: shape.spacing * 2,
        backgroundColor: brandColors.background.paper,
        borderWidth: 1,
        borderColor: brandColors.divider
    },
    button: {
        height: shape.buttonHeight,
        borderRadius: shape.borderRadius,
        paddingHorizontal: shape.spacing * 3
    },
    surface: {
        elevation: 1,
        borderRadius: shape.borderRadius,
        backgroundColor: brandColors.background.elevated
    }
};

// Global styles for consistent layout
export const globalStyles = {
    container: {
        flex: 1,
        backgroundColor: brandColors.background.default,
        padding: shape.spacing * 2
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    shadow: {
        shadowColor: brandColors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    }
};

// Create theme by extending Paper's default theme
export const brandTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: brandColors.primary.main,
        primaryContainer: brandColors.primary.light,
        secondary: brandColors.secondary.main,
        secondaryContainer: brandColors.secondary.light,
        background: brandColors.background.default,
        surface: brandColors.background.paper,
        error: brandColors.status.error,
        onSurface: brandColors.text.primary,
        onSurfaceVariant: brandColors.text.secondary,
        outline: brandColors.divider
    },
    typography,
    shape,
    components,
    brandColors,
    globalStyles
};
