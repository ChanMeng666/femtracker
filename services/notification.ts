import { Alert } from 'react-native';
import { USAGE_HOURS, ProductType, ProductNames } from '@/constants';

type AlertType = 'recommended' | 'maximum';

export const notificationService = {
    // 存储定时器ID
    timers: {
        recommended: null as NodeJS.Timeout | null,
        maximum: null as NodeJS.Timeout | null,
    },

    // 显示提醒
    showAlert(productType: ProductType, alertType: AlertType) {
        const { recommended, maximum } = USAGE_HOURS[productType];
        const productName = ProductNames[productType];

        if (alertType === 'recommended') {
            Alert.alert(
                '建议更换提醒',
                `${productName}已使用${recommended}小时，建议及时更换`,
                [{ text: '知道了', style: 'default' }]
            );
        } else {
            Alert.alert(
                '警告！超过使用时限',
                `${productName}已达到最长使用时限${maximum}小时，请立即更换以避免健康风险！`,
                [{ text: '知道了', style: 'destructive' }]
            );
        }
    },

    // 设置提醒
    scheduleReminder(productType: ProductType) {
        const { recommended, maximum } = USAGE_HOURS[productType];

        // 清除之前的定时器
        this.cancelReminders();

        // 设置建议更换时间的提醒
        this.timers.recommended = setTimeout(() => {
            this.showAlert(productType, 'recommended');
        }, recommended * 3600 * 1000);

        // 设置最长使用时限的警告
        this.timers.maximum = setTimeout(() => {
            this.showAlert(productType, 'maximum');
        }, maximum * 3600 * 1000);
    },

    // 取消提醒
    cancelReminders() {
        if (this.timers.recommended) {
            clearTimeout(this.timers.recommended);
            this.timers.recommended = null;
        }
        if (this.timers.maximum) {
            clearTimeout(this.timers.maximum);
            this.timers.maximum = null;
        }
    }
};
