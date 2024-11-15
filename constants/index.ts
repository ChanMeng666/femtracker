export enum ProductType {
    TAMPON = 'tampon',
    CUP = 'cup'
}

export const ProductNames = {
    [ProductType.TAMPON]: '卫生棉条',
    [ProductType.CUP]: '月经杯'
};

export const USAGE_HOURS = {
    [ProductType.TAMPON]: {
        recommended: 6, // 建议使用时间（小时）
        maximum: 8     // 最长使用时间（小时）
    },
    [ProductType.CUP]: {
        recommended: 10, // 建议使用时间（小时）
        maximum: 12     // 最长使用时间（小时）
    }
};
