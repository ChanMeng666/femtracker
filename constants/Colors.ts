import { brandColors } from '@/app/theme';

// Export brand colors for backward compatibility
export const Colors = {
  primary: {
    main: brandColors.primary.main,
    light: brandColors.primary.light,
    dark: brandColors.primary.dark,
  },
  background: {
    default: brandColors.background.default,
    secondary: brandColors.background.paper,
  },
  text: {
    primary: brandColors.text.primary,
    secondary: brandColors.text.secondary,
  },
  status: {
    warning: brandColors.status.warning,
    error: brandColors.status.error,
    success: brandColors.status.success,
  }
};

export default Colors;
