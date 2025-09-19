import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { 
  CreditCard, 
  Search, 
  Download,
  Filter,
  Gamepad2,
  ShoppingBag,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminTransactionsPage: React.FC = () => {
  const { data: transactions = [], isLoading } = useTransactions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateRange, setDateRange] = useState('');

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || 
        (filterType === 'game' && transaction.gameId) ||
        (filterType === 'product' && !transaction.gameId);
      const matchesStatus = !filterStatus || transaction.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
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
  }, [transactions, searchTerm, filterType, filterStatus, sortBy]);

  // Calculate stats
  const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const gameTransactions = transactions.filter(t => t.gameId).length;
  const productTransactions = transactions.filter(t => !t.gameId).length;
  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;
  const failedTransactions = transactions.filter(t => t.status === 'FAILED').length;

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Status', 'Transaction ID', 'Member ID'],
      ...filteredTransactions.map(transaction => [
        formatDateTime(transaction.date),
        transaction.gameId ? 'Game Purchase' : 'Product Purchase',
        formatCurrency(transaction.amount),
        transaction.status,
        transaction.id,
        transaction.memberId
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
          <CreditCard className="w-8 h-8 text-accent-primary" />
          <h1 className="text-3xl font-bold text-text-primary">All Transactions</h1>
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
              <p className="text-text-muted text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
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
            <CreditCard className="w-8 h-8 text-accent-primary" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Game Purchases</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {gameTransactions}
              </p>
            </div>
            <Gamepad2 className="w-8 h-8 text-accent-secondary" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Product Purchases</p>
              <p className="text-2xl font-bold text-text-primary mt-1">
                {productTransactions}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-accent-tertiary" />
          </div>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Completed</p>
              <p className="text-xl font-bold text-green-400 mt-1">
                {completedTransactions}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Pending</p>
              <p className="text-xl font-bold text-yellow-400 mt-1">
                {pendingTransactions}
              </p>
            </div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Failed</p>
              <p className="text-xl font-bold text-red-400 mt-1">
                {failedTransactions}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
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

          <div className="text-text-muted text-sm flex items-center">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left p-4 text-text-primary font-semibold">Transaction</th>
                <th className="text-left p-4 text-text-primary font-semibold">Type</th>
                <th className="text-left p-4 text-text-primary font-semibold">Amount</th>
                <th className="text-left p-4 text-text-primary font-semibold">Status</th>
                <th className="text-left p-4 text-text-primary font-semibold">Date</th>
                <th className="text-left p-4 text-text-primary font-semibold">Member</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border-primary hover:bg-bg-tertiary/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.gameId 
                          ? 'bg-accent-primary/10' 
                          : 'bg-accent-secondary/10'
                      }`}>
                        {transaction.gameId ? (
                          <Gamepad2 className="w-4 h-4 text-accent-primary" />
                        ) : (
                          <ShoppingBag className="w-4 h-4 text-accent-secondary" />
                        )}
                      </div>
                      <div>
                        <p className="text-text-primary font-medium text-sm">
                          {transaction.id}
                        </p>
                        <p className="text-text-muted text-xs">
                          {transaction.gameId ? 'Game Purchase' : 'Product Purchase'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-text-muted text-sm">
                      {transaction.gameId ? 'Game' : 'Product'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-text-primary font-semibold">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'COMPLETED' 
                        ? 'bg-green-500/20 text-green-400' 
                        : transaction.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-text-muted text-sm">
                      {formatDateTime(transaction.date)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted text-sm">
                        {transaction.memberId}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No transactions found
            </h3>
            <p className="text-text-muted">
              {searchTerm || filterType || filterStatus
                ? 'Try adjusting your search or filter criteria'
                : 'No transactions have been recorded yet'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminTransactionsPage;
