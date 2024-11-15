import { useState, useEffect, useCallback } from 'react';
import { UsageRecord, ActiveProduct } from '@/types';
import { storageService } from '@/services/storage';
import { notificationService } from '@/services/notification';
import { ProductType, USAGE_HOURS } from '@/constants';

export function useUsageRecords() {
    const [records, setRecords] = useState<UsageRecord[]>([]);
    const [activeProduct, setActiveProduct] = useState<ActiveProduct | null>(null);
    const [loading, setLoading] = useState(true);

    const loadRecords = useCallback(async () => {
        const data = await storageService.getUsageRecords();
        setRecords(data);

        const active = data.find(record => !record.removedAt);
        if (active) {
            const { maximum } = USAGE_HOURS[active.productType];
            setActiveProduct({
                productType: active.productType,
                insertedAt: active.insertedAt,
                shouldRemoveAt: active.insertedAt + maximum * 60 * 60 * 1000,
            });
        } else {
            setActiveProduct(null);
        }

        setLoading(false);
    }, []);

    const addRecord = useCallback(async (productType: ProductType) => {
        const newRecord = {
            productType,
            insertedAt: Date.now(),
        };

        const success = await storageService.addUsageRecord(newRecord);
        if (success) {
            // 设置提醒
            notificationService.scheduleReminder(productType);
            loadRecords();
        }
        return success;
    }, [loadRecords]);

    const markRemoved = useCallback(async (id: string) => {
        const success = await storageService.updateUsageRecord(id, {
            removedAt: Date.now(),
        });
        if (success) {
            // 取消提醒
            notificationService.cancelReminders();
            loadRecords();
        }
        return success;
    }, [loadRecords]);

    // 组件卸载时清理定时器
    useEffect(() => {
        return () => {
            notificationService.cancelReminders();
        };
    }, []);

    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    return {
        records,
        activeProduct,
        loading,
        addRecord,
        markRemoved,
        refresh: loadRecords,
    };
}
