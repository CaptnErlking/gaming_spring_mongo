import React, { useState, useMemo } from 'react';
import { useMemberTransactions } from '../hooks/useTransactions';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { 
  History, 
  Search, 
  Filter, 
  Download,
  Gamepad2,
  ShoppingBag,
  CreditCard,
  Calendar,
  DollarSign
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: transactions = [], isLoading } = useMemberTransactions(user?.id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateRange, setDateRange] = useState('');

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || 
        (filterType === 'game' && transaction.gameId) ||
        (filterType === 'product' && !transaction.gameId);
      
      return matchesSearch && matchesType;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchTerm, filterType, sortBy]);

  // Calculate stats
  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const gamePurchases = transactions.filter(t => t.gameId).length;
  const productPurchases = transactions.filter(t => !t.gameId).length;
  const averageTransaction = transactions.length > 0 ? totalSpent / transactions.length : 0;

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Transaction ID'],
      ...filteredTransactions.map(transaction => [
        formatDateTime(transaction.date),
        transaction.gameId ? 'Game Purchase' : 'Product Purchase',
        formatCurrency(transaction.amount),
        transaction.id
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="w-8 h-8 text-accent-primary" />
          <h1 className="text-3xl font-bold text-text-primary">Transaction History</h1>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-accent-primary" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {transactions.length}
              </p>
            </div>
            <History className="w-8 h-8 text-accent-secondary" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Game Purchases</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {gamePurchases}
              </p>
            </div>
            <Gamepad2 className="w-8 h-8 text-accent-tertiary" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Average Transaction</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {formatCurrency(averageTransaction)}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="game">Game Purchases</option>
            <option value="product">Product Purchases</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: Highest First</option>
            <option value="amount-asc">Amount: Lowest First</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </Card>

      {/* Transactions List */}
      <Card>
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    transaction.gameId 
                      ? 'bg-accent-primary/10' 
                      : 'bg-accent-secondary/10'
                  }`}>
                    {transaction.gameId ? (
                      <Gamepad2 className="w-5 h-5 text-accent-primary" />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-accent-secondary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-text-primary font-medium">
                      {transaction.gameId ? 'Game Purchase' : 'Product Purchase'}
                    </h3>
                    <p className="text-text-muted text-sm">
                      {formatDateTime(transaction.date)}
                    </p>
                    <p className="text-text-muted text-xs font-mono">
                      ID: {transaction.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary font-semibold text-lg">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-text-muted text-sm">
                    {transaction.gameId ? 'Game' : 'Product'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No transactions found
              </h3>
              <p className="text-text-muted">
                {searchTerm || filterType 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t made any purchases yet'
                }
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TransactionsPage;
