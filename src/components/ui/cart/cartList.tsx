import { Cart } from '@/models/products.model';
import { Button } from '../button';
import { formatThaiBaht } from '@/util/currency';

interface CartListProps {
    cart: Cart[];
    increaseCart: (product: Cart) => void;
    decreaseCart: (product: Cart) => void;
    updateCart: (product: Cart[]) => void;
}
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BaggageClaim, EllipsisVertical, Trash, Undo2, X } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const CartList = ({
    cart,
    increaseCart,
    decreaseCart,
    updateCart,
}: CartListProps) => {
    const changeType = (product: Cart, value: 'baht' | 'percen') => {
        const updatedCart = cart.map((item) =>
            item.productId === product.productId
                ? {
                      ...item,
                      discountType: value,
                      total:
                          value == 'baht'
                              ? item.price * item.quantity - item.discount
                              : item.price * item.quantity -
                                item.discount / 100,
                  }
                : item
        );

        updateCart(updatedCart);
    };

    const changeDiscount = (
        product: Cart,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedCart = cart.map((item) =>
            item.productId === product.productId
                ? {
                      ...item,
                      discount: Number(e.target.value),
                      total:
                          item.discountType == 'baht'
                              ? item.price * item.quantity -
                                Number(e.target.value)
                              : item.price * item.quantity -
                                (item.price *
                                    item.quantity *
                                    Number(e.target.value)) /
                                    100,
                  }
                : item
        );
        updateCart(updatedCart);
    };

    const sendProductLater = (product: Cart) => {
        updateCart([
            ...cart,
            {
                ...product,
                productId: product.productId + 'L',
                quantity: 1,
                total: product.price * 1,
                discountType: 'baht',
                discount: 0,
                sendLater: true,
            },
        ]);
    };

    const removeProduct = (product: Cart) => {
        const updatedCart = cart.filter(
            (item) => item.productId !== product.productId
        );
        updateCart(updatedCart);
    };
    return (
        <>
            {cart.length ? (
                cart.map((product: Cart) => (
                    <div
                        className='relative flex rounded-lg overflow-hidden w-full h-max border '
                        key={product.productId}
                    >
                        <img
                            src={product.imageUrl}
                            alt=''
                            className='w-28 object-cover'
                        />
                        <div className='flex flex-col gap-1 p-3 flex-1'>
                            <h1 className='text-sm font-medium pr-8'>
                                {product.productName}
                            </h1>
                            <small className='text-neutral-500'>
                                {product.productId}
                            </small>
                            <div className='text-right'>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={() => decreaseCart(product)}
                                >
                                    -
                                </Button>
                                <span className='px-2'>{product.quantity}</span>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={() => increaseCart(product)}
                                >
                                    +
                                </Button>
                            </div>
                            <div className='grid xl:flex justify-between items-center gap-2 mt-auto'>
                                <div className='flex'>
                                    <Input
                                        className=' rounded-r-none'
                                        type='number'
                                        value={product.discount || ''}
                                        onChange={(e) =>
                                            changeDiscount(product, e)
                                        }
                                    />
                                    <Select
                                        onValueChange={(
                                            value: 'baht' | 'percen'
                                        ) => changeType(product, value)}
                                        defaultValue={product.discountType}
                                    >
                                        <SelectTrigger className='rounded-l-none'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='baht'>
                                                ฿
                                            </SelectItem>
                                            <SelectItem value='percen'>
                                                %
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>{formatThaiBaht(product.total)}</div>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size={'icon'}
                                    className='absolute top-1 right-1'
                                >
                                    <EllipsisVertical className='h-4 w-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {product.sendLater ? (
                                    <DropdownMenuItem
                                        onClick={() => removeProduct(product)}
                                    >
                                        <X className='w-4 h-4 text-black' />
                                        ยกเลิกส่งสินค้าตามหลัง
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            sendProductLater(product)
                                        }
                                    >
                                        <Undo2 className='w-4 h-4 text-black' />
                                        ส่งสินค้าตามหลัง
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => removeProduct(product)}
                                >
                                    <Trash className='w-4 h-4 text-red-500' />
                                    <span className='text-red-500'>ลบ</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {product.sendLater ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <BaggageClaim className='h-4 w-4 absolute top-12 right-4' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        ส่งสินค้าจะส้งตามไปทีหลัง
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            false
                        )}
                    </div>
                ))
            ) : (
                <div className='text-center text-neutral-500'>
                    No items in cart
                </div>
            )}
        </>
    );
};

export default CartList;
