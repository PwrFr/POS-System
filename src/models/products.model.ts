export type Product = {
    no: number;
    productId: string;
    productName: string;
    category: string;
    price: number;
    imageUrl: string;
    stock: number;
};

export type Cart = {
    no: number;
    productId: string;
    productName: string;
    category: string;
    price: number;
    imageUrl: string;
    stock: number;
    sendLater: boolean;
    discountType: 'baht' | 'percen';
    discount: number;
    quantity: number;
    total: number;
};

export type ProductListResponse = {
    success: boolean;
    totalProduct: number;
    productList: Product[];
};
