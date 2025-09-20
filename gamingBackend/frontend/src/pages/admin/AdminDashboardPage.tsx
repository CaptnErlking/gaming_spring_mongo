import React from 'react';
import { useMembers, useGames, useProducts, useTransactions } from '../../hooks';
import { formatCurrency } from '../../utils/formatters';
import { 
  Crown, 
  Users, 
  Gamepad2, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboardPage: React.FC = () => {
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: games = [], isLoading: gamesLoading } = useGames();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();

  if (membersLoading || gamesLoading || productsLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate stats
  const totalUsers = members.length;
  const activeUsers = members.filter(member => member.isActive).length;
  const totalGames = games.length;
  const activeGames = games.filter(game => game.status === 'active').length;
  const totalProducts = products.length;
  const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const recentTransactions = transactions.slice(0, 5);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Games',
      value: totalGames.toString(),
      icon: Gamepad2,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
      change: '+3',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: ShoppingBag,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/10',
      change: '+7',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Games',
      value: activeGames.toString(),
      icon: Gamepad2,
      color: 'text-accent-tertiary',
      bgColor: 'bg-accent-tertiary/10',
      change: `${Math.round((activeGames / totalGames) * 100)}%`,
      changeType: 'neutral' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Crown className="w-8 h-8 text-accent-secondary" />
        <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      stat.changeType === 'positive' ? 'text-green-400' : 
                      stat.changeType === 'negative' ? 'text-red-400' : 
                      'text-text-muted'
                    }`} />
                    <span className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-400' : 
                      stat.changeType === 'negative' ? 'text-red-400' : 
                      'text-text-muted'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              Recent Transactions
            </h2>
            <span className="text-text-muted text-sm">
              {transactions.length} total
            </span>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
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
                      <p className="text-text-primary font-medium">
                        {transaction.gameId ? 'Game Purchase' : 'Product Purchase'}
                      </p>
                      <p className="text-text-muted text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-text-primary font-semibold">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No transactions yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* System Status */}
        <Card>
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-text-primary font-medium">Database</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-text-primary font-medium">API Server</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-text-primary font-medium">Payment Gateway</span>
              </div>
              <span className="text-green-400 text-sm font-medium">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-text-primary font-medium">Email Service</span>
              </div>
              <span className="text-yellow-400 text-sm font-medium">Limited</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-accent-primary/10 hover:bg-accent-primary/20 rounded-lg transition-colors text-left">
            <Gamepad2 className="w-6 h-6 text-accent-primary mb-2" />
            <h3 className="font-semibold text-text-primary">Add New Game</h3>
            <p className="text-text-muted text-sm">Create a new game</p>
          </button>
          
          <button className="p-4 bg-accent-secondary/10 hover:bg-accent-secondary/20 rounded-lg transition-colors text-left">
            <ShoppingBag className="w-6 h-6 text-accent-secondary mb-2" />
            <h3 className="font-semibold text-text-primary">Add New Product</h3>
            <p className="text-text-muted text-sm">Create a new product</p>
          </button>
          
          <button className="p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors text-left">
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <h3 className="font-semibold text-text-primary">Manage Users</h3>
            <p className="text-text-muted text-sm">View and manage users</p>
          </button>
          
          <button className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors text-left">
            <DollarSign className="w-6 h-6 text-green-400 mb-2" />
            <h3 className="font-semibold text-text-primary">View Reports</h3>
            <p className="text-text-muted text-sm">Generate reports</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
