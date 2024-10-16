import { useEffect, useState } from 'react';
import useFetchData from '../hooks/useFetchData';
import { format } from 'date-fns';
import { CellWrapper, TableHeader } from './styles';


interface IItem {
    id: number;
    date: string;
    amount: number;
    merchant: string;
    category: string;
}

interface IData {
    totalTransactions: number;
    transactions: IItem[];
}

const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== "string") {
        return '';
    }
    const date = new Date(dateString);
    return format(date, 'HH:mm - dd/MM/yyyy');
};

const capitalizeFirstLetter = (string: string) => {
    if (!string || typeof string !== "string") {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const ExpensesTable = () => {
    const { data, loading, error } = useFetchData<IData>('https://tip-transactions.vercel.app/api/transactions?page=1');
    const [transactions, setTransactions] = useState<IItem[]>([]);

    useEffect(() => {
            if (data && data.transactions) {
                setTransactions(data.transactions);
            }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (transactions.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="expenses table">
                <thead>
                    <TableHeader>
                        <CellWrapper scope="col">ID</CellWrapper>
                        <CellWrapper scope="col">Date</CellWrapper>
                        <CellWrapper scope="col">Amount</CellWrapper>
                        <CellWrapper scope="col">Merchant</CellWrapper>
                        <CellWrapper scope="col">Category</CellWrapper>
                    </TableHeader>
                </thead>
                <tbody>
                {transactions.map((row) => (
                    <tr key={row.id}>
                            <CellWrapper data-label="ID">{row.id}</CellWrapper>
                            <CellWrapper data-label="Date">{formatDate(row.date)}</CellWrapper>
                            <CellWrapper data-label="Amount">£{row.amount.toFixed(2)}</CellWrapper>
                            <CellWrapper data-label="Merchant">{row.merchant}</CellWrapper>
                            <CellWrapper data-label="Category">{capitalizeFirstLetter(row.category)}</CellWrapper>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpensesTable;
