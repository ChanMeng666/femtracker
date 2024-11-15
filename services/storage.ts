import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsageRecord } from '@/types';

const STORAGE_KEYS = {
    USAGE_RECORDS: 'usage_records',
};

export const storageService = {
    async getUsageRecords(): Promise<UsageRecord[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_RECORDS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to get usage records:', error);
            return [];
        }
    },

    async addUsageRecord(record: Omit<UsageRecord, 'id'>): Promise<boolean> {
        try {
            const records = await this.getUsageRecords();
            const newRecord = {
                ...record,
                id: Date.now().toString(),
            };
            await AsyncStorage.setItem(
                STORAGE_KEYS.USAGE_RECORDS,
                JSON.stringify([...records, newRecord])
            );
            return true;
        } catch (error) {
            console.error('Failed to add usage record:', error);
            return false;
        }
    },

    async updateUsageRecord(id: string, updates: Partial<UsageRecord>): Promise<boolean> {
        try {
            const records = await this.getUsageRecords();
            const index = records.findIndex(record => record.id === id);
            if (index === -1) return false;

            records[index] = { ...records[index], ...updates };
            await AsyncStorage.setItem(
                STORAGE_KEYS.USAGE_RECORDS,
                JSON.stringify(records)
            );
            return true;
        } catch (error) {
            console.error('Failed to update usage record:', error);
            return false;
        }
    },
};
