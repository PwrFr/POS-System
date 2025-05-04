export const formatThaiBaht = (amount: number) => {
    const formattedAmount = amount
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return `฿${formattedAmount}`;
};
