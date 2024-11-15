import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsageRecords } from '@/hooks/useUsageRecords';
import { ProductNames } from '@/constants';
import { brandTheme } from '@/src/theme';

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
                    {dateRecords.reverse().map((record) => (
                        <Card key={record.id} style={styles.recordCard}>
                            <LinearGradient
                                colors={[brandTheme.brandColors.background.paper, brandTheme.brandColors.background.elevated]}
                                style={styles.cardGradient}
                            >
                                <Card.Content>
                                    <View style={styles.recordHeader}>
                                        <View style={styles.productInfo}>
                                            <MaterialCommunityIcons
                                                name={record.productType === 'tampon' ? 'bandage' : 'cup'}
                                                size={24}
                                                color={brandTheme.brandColors.primary.main}
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
                                        <Text variant="bodyMedium" style={styles.timeText}>
                                            放入时间: {formatTime(record.insertedAt)}
                                        </Text>
                                        {record.removedAt && (
                                            <Text variant="bodyMedium" style={styles.timeText}>
                                                取出时间: {formatTime(record.removedAt)}
                                            </Text>
                                        )}
                                    </View>
                                </Card.Content>
                            </LinearGradient>
                        </Card>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...brandTheme.globalStyles.container,
    },
    dateHeader: {
        marginVertical: brandTheme.shape.spacing,
        color: brandTheme.brandColors.text.secondary,
        ...brandTheme.typography.titleMedium,
    },
    recordCard: {
        marginBottom: brandTheme.shape.spacing,
        overflow: 'hidden',
        ...brandTheme.components.card,
    },
    cardGradient: {
        borderRadius: brandTheme.shape.borderRadius,
    },
    recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: brandTheme.shape.spacing,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productName: {
        marginLeft: brandTheme.shape.spacing,
        color: brandTheme.brandColors.text.primary,
        ...brandTheme.typography.titleMedium,
    },
    duration: {
        color: brandTheme.brandColors.text.secondary,
        ...brandTheme.typography.bodyMedium,
    },
    divider: {
        backgroundColor: brandTheme.brandColors.divider,
        marginVertical: brandTheme.shape.spacing,
    },
    timeInfo: {
        marginTop: brandTheme.shape.spacing,
    },
    timeText: {
        color: brandTheme.brandColors.text.secondary,
        marginBottom: brandTheme.shape.spacing / 2,
        ...brandTheme.typography.bodyMedium,
    },
});
