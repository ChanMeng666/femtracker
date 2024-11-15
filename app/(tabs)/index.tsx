import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, Portal, Dialog, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUsageRecords } from '@/hooks/useUsageRecords';
import { ProductType, ProductNames, USAGE_HOURS } from '@/constants';
import Colors from '../../constants/Colors';
import {storageService} from "@/services/storage";

export default function RecordScreen() {
    const { activeProduct, addRecord, markRemoved } = useUsageRecords();
    const [elapsedTime, setElapsedTime] = useState<string>('');
    const [timeUntilRecommended, setTimeUntilRecommended] = useState<string>('');
    const [timeUntilMaximum, setTimeUntilMaximum] = useState<string>('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    // 格式化时间
    const formatTime = (milliseconds: number): string => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // 更新计时器
    useEffect(() => {
        if (!activeProduct) {
            setElapsedTime('');
            setTimeUntilRecommended('');
            setTimeUntilMaximum('');
            return;
        }

        const timer = setInterval(() => {
            const now = Date.now();
            const elapsed = now - activeProduct.insertedAt;
            setElapsedTime(formatTime(elapsed));

            const { recommended, maximum } = USAGE_HOURS[activeProduct.productType];
            const recommendedTime = activeProduct.insertedAt + (recommended * 60 * 60 * 1000) - now;
            const maximumTime = activeProduct.insertedAt + (maximum * 60 * 60 * 1000) - now;

            setTimeUntilRecommended(recommendedTime > 0 ? formatTime(recommendedTime) : '已超过建议时间');
            setTimeUntilMaximum(maximumTime > 0 ? formatTime(maximumTime) : '已超过最长时限！');
        }, 1000);

        return () => clearInterval(timer);
    }, [activeProduct]);

    // 处理插入记录
    const handleInsert = async (type: ProductType) => {
        if (activeProduct) {
            setSelectedProduct(type);
            setShowConfirmDialog(true);
            return;
        }
        await addRecord(type);
    };

    // 处理移除记录
    const handleRemove = async () => {
        if (activeProduct) {
            const records = await storageService.getUsageRecords();
            const activeRecord = records.find(r => !r.removedAt);
            if (activeRecord) {
                await markRemoved(activeRecord.id);
            }
        }
    };

    const getStatusColor = () => {
        if (!activeProduct) return Colors.text.primary;
        const now = Date.now();
        const elapsed = now - activeProduct.insertedAt;
        const { recommended, maximum } = USAGE_HOURS[activeProduct.productType];

        if (elapsed >= maximum * 60 * 60 * 1000) {
            return Colors.status.error;
        }
        if (elapsed >= recommended * 60 * 60 * 1000) {
            return Colors.status.warning;
        }
        return Colors.status.success;
    };

    return (
        <View style={styles.container}>
            {activeProduct ? (
                <Card style={styles.statusCard}>
                    <Card.Content>
                        <Surface style={[styles.statusBanner, { backgroundColor: getStatusColor() }]}>
                            <Text variant="titleLarge" style={styles.statusTitle}>
                                使用中
                            </Text>
                        </Surface>

                        <View style={styles.productInfo}>
                            <MaterialCommunityIcons
                                name={activeProduct.productType === ProductType.TAMPON ? 'bandage' : 'cup'}
                                size={32}
                                color={Colors.primary.main}
                            />
                            <Text variant="headlineSmall" style={styles.productName}>
                                {ProductNames[activeProduct.productType]}
                            </Text>
                        </View>

                        <View style={styles.timeInfo}>
                            <Text variant="titleMedium" style={styles.timeLabel}>已使用时间</Text>
                            <Text variant="headlineMedium" style={[styles.timeValue, { color: getStatusColor() }]}>
                                {elapsedTime}
                            </Text>

                            <Text variant="titleMedium" style={styles.timeLabel}>建议更换时间还剩</Text>
                            <Text variant="headlineMedium" style={styles.timeValue}>
                                {timeUntilRecommended}
                            </Text>

                            <Text variant="titleMedium" style={styles.timeLabel}>最长使用时限还剩</Text>
                            <Text variant="headlineMedium" style={[
                                styles.timeValue,
                                { color: timeUntilMaximum.includes('超过') ? Colors.status.error : Colors.text.primary }
                            ]}>
                                {timeUntilMaximum}
                            </Text>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleRemove}
                            style={styles.removeButton}
                        >
                            记录取出
                        </Button>
                    </Card.Content>
                </Card>
            ) : (
                <View style={styles.buttonContainer}>
                    <Text variant="headlineMedium" style={styles.title}>
                        记录使用
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => handleInsert(ProductType.TAMPON)}
                        style={styles.insertButton}
                        contentStyle={styles.buttonContent}
                    >
                        放入卫生棉条
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => handleInsert(ProductType.CUP)}
                        style={styles.insertButton}
                        contentStyle={styles.buttonContent}
                    >
                        放入月经杯
                    </Button>
                </View>
            )}

            <Portal>
                <Dialog
                    visible={showConfirmDialog}
                    onDismiss={() => setShowConfirmDialog(false)}
                >
                    <Dialog.Title>确认更换</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            您当前已有正在使用的产品，是否要记录取出并更换新的产品？
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowConfirmDialog(false)}>取消</Button>
                        <Button
                            onPress={async () => {
                                setShowConfirmDialog(false);
                                if (selectedProduct) {
                                    await handleRemove();
                                    await addRecord(selectedProduct);
                                    setSelectedProduct(null);
                                }
                            }}
                        >
                            确认
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.background.default,
    },
    title: {
        textAlign: 'center',
        marginBottom: 32,
        color: Colors.text.primary,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    insertButton: {
        marginVertical: 8,
        height: 56,
    },
    buttonContent: {
        height: 56,
    },
    statusCard: {
        marginTop: 16,
    },
    statusBanner: {
        padding: 8,
        marginBottom: 16,
        borderRadius: 8,
    },
    statusTitle: {
        textAlign: 'center',
        color: Colors.background.default,
        fontWeight: 'bold',
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    productName: {
        marginLeft: 8,
        color: Colors.text.primary,
        fontWeight: 'bold',
    },
    timeInfo: {
        marginBottom: 24,
    },
    timeLabel: {
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    timeValue: {
        textAlign: 'center',
        marginBottom: 16,
        fontVariant: ['tabular-nums'],
    },
    removeButton: {
        marginTop: 8,
    },
});
