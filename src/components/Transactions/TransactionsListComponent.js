import React, { useEffect, useState, useRef } from 'react';
import { Table, Pagination, Form, Button } from 'react-bootstrap';

function TransactionsListComponents() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [amountMin, setAmountMin] = useState('');
    const [amountMax, setAmountMax] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const transactionsPerPage = 10; // Number of transactions per page

    const fetchTransactions = async (page = 1) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }
        try {
            setLoading(true);
            const url = new URL('http://localhost:3000/transactions');
            url.searchParams.append('userId', userId);
            url.searchParams.append('page', page);
            url.searchParams.append('limit', transactionsPerPage);
            if (amountMin) url.searchParams.append('amountMin', amountMin);
            if (amountMax) url.searchParams.append('amountMax', amountMax);
            if (transactionType) url.searchParams.append('transactionType', transactionType);

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const data = await response.json();
            setTransactions(data.transactions);
            setTotalPages(Math.ceil(data.totalCount / transactionsPerPage));
            setCurrentPage(page);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(() => {
            fetchTransactions(1);
        }, 1000));
    }, [amountMin, amountMax, transactionType]);

    const handlePageChange = (page) => {
        fetchTransactions(page);
    };

    if (isLoading) return <div className="text-center">Loading...</div>;

    return (
        <div className='container mt-5'>
            <h2 className='text-center'>Liste des transactions</h2>

            <div className="d-flex justify-content-center mb-3">
                <Form.Group className="mx-2">
                    <Form.Label>Montant Minimum</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Min"
                        value={amountMin}
                        onChange={(e) => setAmountMin(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mx-2">
                    <Form.Label>Montant Maximum</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Max"
                        value={amountMax}
                        onChange={(e) => setAmountMax(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mx-2">
                    <Form.Label>Type de Transaction</Form.Label>
                    <Form.Select
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <option value="">Tous</option>
                        <option value="DEPOT">DEPOT</option>
                        <option value="ACHAT">ACHAT</option>
                        <option value="RETRAIT">RETRAIT</option>
                    </Form.Select>
                </Form.Group>

                <Button className="align-self-end" variant="primary" onClick={() => fetchTransactions(1)}>
                    Filtrer
                </Button>
            </div>

            <Table striped bordered hover responsive className="text-center">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Montant</th>
                        <th>Type</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <tr key={transaction.id}>
                                <th scope="row">{(currentPage - 1) * transactionsPerPage + index + 1}</th>
                                <td>{transaction.amount}</td>
                                <td>{transaction.type}</td>
                                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Pagination className="justify-content-center">
                {[...Array(totalPages).keys()].map(pageNumber => (
                    <Pagination.Item
                        key={pageNumber + 1}
                        active={pageNumber + 1 === currentPage}
                        onClick={() => handlePageChange(pageNumber + 1)}
                    >
                        {pageNumber + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div >
    );
}

export default TransactionsListComponents;