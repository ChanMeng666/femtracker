import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUsageRecords } from '@/hooks/useUsageRecords';
import { ProductNames } from '@/constants';
import Colors from '../../constants/Colors';

export default function ExploreScreen() {
    const { records } = useUsageRecords();

    const formatDuration = (insertedAt: number, removedAt?: number) => {
        const start = new Date(insertedAt);
        const end = removedAt ? new Date(removedAt) : new Date();
        const diff = end.getTime() - start.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}小时${minutes}分钟`;
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN', {
            month: 'long',
            day: 'numeric'
        });
    };

    // 按日期分组记录
    const groupedRecords = records.reduce((groups: Record<string, typeof records>, record) => {
        const date = formatDate(record.insertedAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(record);
        return groups;
    }, {});

    return (
        <ScrollView style={styles.container}>
            {Object.entries(groupedRecords).reverse().map(([date, dateRecords]) => (
                <View key={date}>
                    <Text variant="titleMedium" style={styles.dateHeader}>
                        {date}
                    </Text>
                    {dateRecords.reverse().map((record, index) => (
                        <Card key={record.id} style={styles.recordCard}>
                            <Card.Content>
                                <View style={styles.recordHeader}>
                                    <View style={styles.productInfo}>
                                        <MaterialCommunityIcons
                                            name={record.productType === 'tampon' ? 'bandage' : 'cup'}
                                            size={24}
                                            color={Colors.primary.main}
                                        />
                                        <Text variant="titleMedium" style={styles.productName}>
                                            {ProductNames[record.productType]}
                                        </Text>
                                    </View>
                                    <Text variant="bodyMedium" style={styles.duration}>
                                        {formatDuration(record.insertedAt, record.removedAt)}
                                    </Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.timeInfo}>
                                    <Text variant="bodyMedium">
                                        放入时间: {formatTime(record.insertedAt)}
                                    </Text>
                                    {record.removedAt && (
                                        <Text variant="bodyMedium">
                                            取出时间: {formatTime(record.removedAt)}
                                        </Text>
                                    )}
                                </View>
                            </Card.Content>
                        </Card>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.background.default,
    },
    dateHeader: {
        marginVertical: 8,
        color: Colors.text.secondary,
    },
    recordCard: {
        marginBottom: 8,
    },
    recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productName: {
        marginLeft: 8,
        color: Colors.text.primary,
    },
    duration: {
        color: Colors.text.secondary,
    },
    divider: {
        marginVertical: 8,
    },
    timeInfo: {
        marginTop: 8,
    },
});
