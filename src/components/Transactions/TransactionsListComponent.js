import React, { useEffect, useState } from 'react';

function TransactionsListComponents() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/transactions?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                setTransactions(data.transactions);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (!transactions.length) return <div>No transactions found.</div>;

    return (
        <div className='text-center mt-5'>
            <h2>Liste des transactions</h2>
            <table className="table text-center">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Type</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={transaction.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{transaction.amount}</td>
                            <td>{transaction.type}</td>
                            <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionsListComponents;