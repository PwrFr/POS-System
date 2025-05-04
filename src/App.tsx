import { ChangeEventHandler, useEffect, useState } from 'react';
import products from '@/assets/json/product.json';
import { Input } from '@/components/ui/input';

import { Button } from './components/ui/button';
import {
    ShoppingCart,
    ChevronRight,
    ChevronLeft,
    Search,
    Minus,
    Plus,
} from 'lucide-react';
import { debounce } from 'lodash';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    // DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Cart, Product } from './models/products.model';
import CartList from './components/ui/cart/cartList';
import { formatThaiBaht } from './util/currency';

function App() {
    const snapPoint = [1.1];
    const [position, setPosition] = useState<number | string | null>(
        snapPoint[0]
    );

    const [category, setCategory] = useState<string>('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        const handleResize = () => {
            // Mobile breakpoint (less than 768px)
            if (window.innerWidth < 768) {
                setItemsPerPage(4);
            } else {
                setItemsPerPage(6);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(
        products.productList
    );

    const [searchTerm, setSearchTerm] = useState('');
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleChange = debounce(onChange, 500);

    useEffect(() => {
        setCurrentPage(1);
        if (category === 'all' && searchTerm === '') {
            setFilteredProducts(products.productList);
        } else {
            const filtered = products.productList.filter(
                (product) =>
                    (category === 'all' || product.category === category) &&
                    (searchTerm === '' ||
                        product.productName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        product.productId
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, category]);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const [cart, setCart] = useState<Cart[]>([]);

    const updateCart = (e: Cart[]) => {
        setCart(e);
    };

    const increaseCart = (e: Product) => {
        setCart((prev) => {
            const foundIndex = prev.findIndex(
                (item) => item.productId === e.productId
            );

            if (foundIndex < 0) {
                return [
                    ...prev,
                    {
                        ...e,
                        quantity: 1,
                        total: e.price * 1,
                        discountType: 'baht',
                        discount: 0,
                        sendLater: false,
                    },
                ];
            } else {
                return prev.map((item, index) =>
                    index === foundIndex
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                              total: item.price * (item.quantity + 1),
                          }
                        : item
                );
            }
        });
    };

    const decreaseCart = (e: Product | Cart) => {
        setCart((prev) => {
            const foundIndex = prev.findIndex(
                (item) => item.productId === e.productId
            );

            if (foundIndex < 0) {
                return prev;
            }

            if (prev[foundIndex].quantity === 1) {
                return prev.filter((item) => item.productId !== e.productId);
            } else {
                return prev.map((item, index) =>
                    index === foundIndex
                        ? {
                              ...item,
                              quantity: item.quantity - 1,
                              total: item.price * (item.quantity - 1),
                          }
                        : item
                );
            }
        });
    };

    const [discountType, setDiscountType] = useState<string>('baht');
    const [discount, setDiscount] = useState('');

    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);

    if (!filteredProducts) return <div>Loading...</div>;

    return (
        <div className=' mx-auto container'>
            <nav className='grid grid-cols-12 gap-8 py-4 px-4 md:px-0 sticky top-0 backdrop-blur-sm z-10'>
                <div className='col-span-8'>
                    <img
                        className='h-12 object-cover w-24'
                        src='https://internth.com/_next/image?url=https%3A%2F%2Fmedia.internth.com%2Fcompany%2F2332%2Fb65f6ede14e8c485a78f1501f1fb51ab.png&w=640&q=75'
                        alt=''
                    />
                </div>
                <div className='col-span-4 flex justify-end md:justify-start items-center gap-4'>
                    <div className='flex gap-2'>
                        <div className='h-12 w-12 bg-neutral-200 rounded-lg'></div>

                        <div className='hidden md:flex flex-col'>
                            <h1 className='text-md truncate'>
                                Pawaris Wongsaied
                            </h1>
                            <small className='text-neutral-500'>
                                Frontend Developer
                            </small>
                        </div>
                    </div>
                    <Drawer
                        snapPoints={snapPoint}
                        activeSnapPoint={position}
                        setActiveSnapPoint={setPosition}
                    >
                        <DrawerTrigger asChild className='block md:hidden'>
                            <Button
                                variant={'outline'}
                                size={'icon'}
                                className='relative flex'
                            >
                                <ShoppingCart className='w-5 h-5 ' />
                                <div className='absolute -top-2 -right-2 bg-red-500 h-5 w-5 rounded-full text-white'>
                                    {cart.length}
                                </div>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className='bg-white flex flex-col rounded-t-[10px] h-full mt-24 max-h-[96%]'>
                            <div className='p-2 bg-white rounded-t-[10px] flex-1'>
                                <div className='max-w-md mx-auto'>
                                    <DrawerHeader>
                                        <DrawerTitle className='font-bold text-2xl mb-4'>
                                            Cart
                                        </DrawerTitle>
                                        <div className='grid gap-2'>
                                            <div className='grid gap-2 content-start h-[35dvh] overflow-auto'>
                                                <CartList
                                                    cart={cart}
                                                    decreaseCart={decreaseCart}
                                                    increaseCart={increaseCart}
                                                    updateCart={updateCart}
                                                />
                                            </div>
                                            <div className='grid gap-x-4 gap-y-2 grid-cols-2'>
                                                <div className='col-span-2 flex justify-between'>
                                                    <span>ราคา</span>
                                                    <span>
                                                        {formatThaiBaht(
                                                            subTotal
                                                        )}
                                                    </span>
                                                </div>
                                                <div className='col-span-2 flex justify-between'>
                                                    <span>รวม Vat7%</span>
                                                    <span>
                                                        {formatThaiBaht(
                                                            subTotal * 1.07
                                                        )}
                                                    </span>
                                                </div>
                                                <div className='col-span-2 flex justify-between items-center'>
                                                    <span>ส่วนลดท้ายบิล</span>
                                                    <div className='flex'>
                                                        <Input
                                                            className='w-32 rounded-r-none'
                                                            value={discount}
                                                            onChange={(e) =>
                                                                setDiscount(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            type='number'
                                                        />
                                                        <Select
                                                            onValueChange={
                                                                setDiscountType
                                                            }
                                                            defaultValue={
                                                                discountType
                                                            }
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
                                                </div>
                                                <div className='col-span-2 flex justify-between text-xl font-normal'>
                                                    <span>ราคารวมทั้งหมด</span>
                                                    <span>
                                                        {formatThaiBaht(
                                                            discountType ==
                                                                'baht'
                                                                ? subTotal *
                                                                      1.07 -
                                                                      Number(
                                                                          discount
                                                                      )
                                                                : subTotal *
                                                                      1.07 -
                                                                      (subTotal *
                                                                          1.07 *
                                                                          Number(
                                                                              discount
                                                                          )) /
                                                                          100
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </DrawerHeader>

                                    <DrawerFooter>
                                        <Button>ชำระเงิน</Button>
                                        <DrawerClose asChild>
                                            <Button variant={'secondary'}>
                                                ยกเลิก
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </nav>
            <div className='px-4 pb-4'>
                <div className='grid grid-cols-12 gap-8'>
                    <div className='col-span-12 md:col-span-8 '>
                        <div className='grid md:flex gap-2 content-center'>
                            <div className='relative'>
                                <Input
                                    type='text'
                                    placeholder='Search'
                                    className='pl-7  ease-in-out duration-500'
                                    onChange={handleChange}
                                />
                                <Search className='absolute flex top-2.5 left-2 w-4 h-4' />
                            </div>
                            <div className='flex gap-1'>
                                <Button
                                    className='capitalize'
                                    variant={
                                        category == 'all'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setCategory('all')}
                                >
                                    All
                                </Button>
                                {[
                                    ...new Set(
                                        products.productList.map(
                                            (product) => product.category
                                        )
                                    ),
                                ].map((cat: string, index: number) => (
                                    <Button
                                        key={index}
                                        className='capitalize'
                                        variant={
                                            category == cat
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className='grid grid-cols-12 gap-2 py-2 place-content-start'>
                            {currentProducts.length == 0 ? (
                                <div className='col-span-12 text-center text-neutral-600'>
                                    No product found
                                </div>
                            ) : (
                                currentProducts.map((product) => (
                                    <div
                                        className='col-span-6 md:col-span-4 overflow-hidden rounded-lg group relative'
                                        key={product.productId}
                                    >
                                        <img
                                            src={product.imageUrl}
                                            alt=''
                                            className='rounded-lg object-cover'
                                        />
                                        <div className='xl:absolute bottom-0 w-full xl:grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 backdrop-blur-md bg-white/50'>
                                            <div className='overflow-hidden bottom-0'>
                                                <div className='flex flex-col gap-1 w-full p-2'>
                                                    <div className='text-sm font-medium'>
                                                        {product.productName}
                                                    </div>
                                                    <small className='text-neutral-600'>
                                                        {product.productId}
                                                    </small>
                                                    <div className='grid grid-cols-1 xl:flex justify-between items-end'>
                                                        <span>
                                                            {formatThaiBaht(
                                                                product.price
                                                            )}
                                                        </span>

                                                        {cart.findIndex(
                                                            (p) =>
                                                                p.productId ==
                                                                product.productId
                                                        ) >= 0 ? (
                                                            <div className='bg-white rounded-lg flex items-center shadow justify-between'>
                                                                <Button
                                                                    onClick={() =>
                                                                        decreaseCart(
                                                                            product
                                                                        )
                                                                    }
                                                                    size={'sm'}
                                                                >
                                                                    <Minus />
                                                                </Button>
                                                                <span className='px-4'>
                                                                    {
                                                                        cart.find(
                                                                            (
                                                                                p
                                                                            ) =>
                                                                                p.productId ==
                                                                                product.productId
                                                                        )
                                                                            ?.quantity
                                                                    }
                                                                </span>
                                                                <Button
                                                                    onClick={() =>
                                                                        increaseCart(
                                                                            product
                                                                        )
                                                                    }
                                                                    size={'sm'}
                                                                >
                                                                    <Plus />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                className='justify-center'
                                                                size={'sm'}
                                                                onClick={() =>
                                                                    increaseCart(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                <ShoppingCart />
                                                                +
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <nav className='flex justify-center md:justify-start gap-1'>
                            <Button
                                onClick={() =>
                                    paginate(
                                        currentPage > 1 ? currentPage - 1 : 1
                                    )
                                }
                                disabled={currentPage === 1}
                                variant={'outline'}
                                size={'icon'}
                            >
                                <ChevronLeft />
                            </Button>

                            {Array.from({
                                length: Math.ceil(
                                    filteredProducts.length / itemsPerPage
                                ),
                            }).map((_, index) => (
                                <Button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    variant={
                                        currentPage === index + 1
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size={'icon'}
                                >
                                    {index + 1}
                                </Button>
                            ))}

                            <Button
                                onClick={() =>
                                    paginate(
                                        currentPage <
                                            Math.ceil(
                                                filteredProducts.length /
                                                    itemsPerPage
                                            )
                                            ? currentPage + 1
                                            : Math.ceil(
                                                  filteredProducts.length /
                                                      itemsPerPage
                                              )
                                    )
                                }
                                disabled={
                                    currentPage ===
                                    Math.ceil(
                                        filteredProducts.length / itemsPerPage
                                    )
                                }
                                variant={'outline'}
                                size={'icon'}
                            >
                                <ChevronRight />
                            </Button>
                        </nav>
                    </div>
                    <div className='hidden md:grid col-span-4 content-between'>
                        <h1 className='text-2xl font-bold mb-2'>Cart</h1>
                        <div className='grid content-start gap-2 h-[55dvh] overflow-auto'>
                            <CartList
                                cart={cart}
                                decreaseCart={decreaseCart}
                                increaseCart={increaseCart}
                                updateCart={updateCart}
                            />
                        </div>
                        <div className='grid gap-x-4 gap-y-2 grid-cols-2 mt-2'>
                            <div className='col-span-2 flex justify-between'>
                                <span>ราคา</span>
                                <span>{formatThaiBaht(subTotal)}</span>
                            </div>
                            <div className='col-span-2 flex justify-between'>
                                <span>รวม Vat7%</span>
                                <span>{formatThaiBaht(subTotal * 1.07)}</span>
                            </div>
                            <div className='col-span-2 flex justify-between items-center'>
                                <span>ส่วนลดท้ายบิล</span>
                                <div className='flex'>
                                    <Input
                                        className='w-32 rounded-r-none'
                                        value={discount}
                                        onChange={(e) =>
                                            setDiscount(e.target.value)
                                        }
                                        type='number'
                                    />
                                    <Select
                                        onValueChange={setDiscountType}
                                        defaultValue={discountType}
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
                            </div>
                            <div className='col-span-2 flex justify-between text-xl font-normal mb-2'>
                                <span>ราคารวมทั้งหมด</span>
                                <span>
                                    {formatThaiBaht(
                                        discountType == 'baht'
                                            ? subTotal * 1.07 - Number(discount)
                                            : subTotal * 1.07 -
                                                  (subTotal *
                                                      1.07 *
                                                      Number(discount)) /
                                                      100
                                    )}
                                </span>
                            </div>
                            <Button className='col-span-2'>ชำระเงิน</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
