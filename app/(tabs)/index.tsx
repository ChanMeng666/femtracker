import React, { useState, useEffect } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import { Card, Text, Portal, Dialog, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsageRecords } from '@/hooks/useUsageRecords';
import { ProductType, ProductNames, USAGE_HOURS } from '@/constants';
import { brandTheme } from '@/src/theme';
import { BrandButton } from '@/components/BrandButton';
import {storageService} from "@/services/storage";
import LottieView from 'lottie-react-native';

export default function RecordScreen() {
    const { activeProduct, addRecord, markRemoved } = useUsageRecords();
    const [elapsedTime, setElapsedTime] = useState<string>('');
    const [timeUntilRecommended, setTimeUntilRecommended] = useState<string>('');
    const [timeUntilMaximum, setTimeUntilMaximum] = useState<string>('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    const formatTime = (milliseconds: number): string => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

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

    const handleInsert = async (type: ProductType) => {
        if (activeProduct) {
            setSelectedProduct(type);
            setShowConfirmDialog(true);
            return;
        }
        await addRecord(type);
    };

    const handleRemove = async () => {
        if (activeProduct) {
            // 获取所有记录
            const records = await storageService.getUsageRecords();
            // 找到当前活跃的记录（没有removedAt的记录）
            const activeRecord = records.find(r => !r.removedAt);
            if (activeRecord) {
                // 调用markRemoved更新记录
                await markRemoved(activeRecord.id);
            }
        }
    };

    const getStatusColor = () => {
        if (!activeProduct) return brandTheme.brandColors.text.primary;
        const now = Date.now();
        const elapsed = now - activeProduct.insertedAt;
        const { recommended, maximum } = USAGE_HOURS[activeProduct.productType];

        if (elapsed >= maximum * 60 * 60 * 1000) {
            return brandTheme.brandColors.status.error;
        }
        if (elapsed >= recommended * 60 * 60 * 1000) {
            return brandTheme.brandColors.status.warning;
        }
        return brandTheme.brandColors.status.success;
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
        >
            {activeProduct ? (
                <Card style={styles.statusCard}>
                    <LinearGradient
                        colors={[brandTheme.brandColors.background.paper, brandTheme.brandColors.background.elevated]}
                        style={styles.cardGradient}
                    >
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
                                    color={brandTheme.brandColors.primary.main}
                                />
                                <Text variant="headlineSmall" style={styles.productName}>
                                    {ProductNames[activeProduct.productType]}
                                </Text>
                            </View>

                            {/* 添加 Lottie 动画 */}
                            <View style={styles.lottieContainer}>
                                <LottieView
                                    source={require('@/assets/Lottie/blood.json')}
                                    autoPlay
                                    loop
                                    style={styles.lottieAnimation}
                                />
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
                                    { color: timeUntilMaximum.includes('超过') ? brandTheme.brandColors.status.error : brandTheme.brandColors.text.primary }
                                ]}>
                                    {timeUntilMaximum}
                                </Text>
                            </View>

                            <BrandButton
                                title="记录取出"
                                onPress={handleRemove}
                                mode="secondary"
                                style={styles.removeButton}
                            />
                        </Card.Content>
                    </LinearGradient>
                </Card>
            ) : (
                <View style={styles.buttonContainer}>
                    <Text variant="displayLarge" style={styles.title}>
                        记录使用
                    </Text>
                    <BrandButton
                        title="放入卫生棉条"
                        onPress={() => handleInsert(ProductType.TAMPON)}
                        style={styles.insertButton}
                    />
                    <BrandButton
                        title="放入月经杯"
                        onPress={() => handleInsert(ProductType.CUP)}
                        style={styles.insertButton}
                    />
                </View>
            )}

            <Portal>
                <Dialog
                    visible={showConfirmDialog}
                    onDismiss={() => setShowConfirmDialog(false)}
                    style={styles.dialog}
                >
                    <Dialog.Title>确认更换</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            您当前已有正在使用的产品，是否要记录取出并更换新的产品？
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <BrandButton
                            title="取消"
                            onPress={() => setShowConfirmDialog(false)}
                            mode="secondary"
                        />
                        <BrandButton
                            title="确认"
                            onPress={async () => {
                                setShowConfirmDialog(false);
                                if (selectedProduct) {
                                    await handleRemove();
                                    await addRecord(selectedProduct);
                                    setSelectedProduct(null);
                                }
                            }}
                        />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: brandTheme.brandColors.background.default,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: brandTheme.shape.spacing * 2,
        paddingBottom: brandTheme.shape.spacing * 4,
    },
    container: {
        ...brandTheme.globalStyles.container,
    },
    title: {
        textAlign: 'center',
        marginBottom: brandTheme.shape.spacing * 4,
        color: brandTheme.brandColors.text.primary,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    insertButton: {
        marginVertical: brandTheme.shape.spacing,
    },
    statusCard: {
        marginTop: brandTheme.shape.spacing * 2,
        overflow: 'hidden',
    },
    cardGradient: {
        borderRadius: brandTheme.shape.borderRadius,
    },
    statusBanner: {
        padding: brandTheme.shape.spacing,
        marginBottom: brandTheme.shape.spacing * 2,
        borderRadius: brandTheme.shape.borderRadius,
    },
    statusTitle: {
        textAlign: 'center',
        color: brandTheme.brandColors.background.default,
        fontWeight: 'bold',
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: brandTheme.shape.spacing * 3,
    },
    productName: {
        marginLeft: brandTheme.shape.spacing,
        color: brandTheme.brandColors.text.primary,
        fontWeight: 'bold',
    },
    timeInfo: {
        marginBottom: brandTheme.shape.spacing * 3,
    },
    timeLabel: {
        color: brandTheme.brandColors.text.secondary,
        marginBottom: brandTheme.shape.spacing / 2,
    },
    timeValue: {
        textAlign: 'center',
        marginBottom: brandTheme.shape.spacing * 2,
        fontVariant: ['tabular-nums'],
    },
    removeButton: {
        marginTop: brandTheme.shape.spacing,
    },
    dialog: {
        backgroundColor: brandTheme.brandColors.background.paper,
    },
    lottieContainer: {
        alignItems: 'center',
        marginVertical: brandTheme.shape.spacing * 2,
        height: 120,
    },
    lottieAnimation: {
        width: 120,
        height: 120,
    },
});
