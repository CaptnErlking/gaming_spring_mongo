import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMemberTransactions, useMemberRecharges } from '../hooks';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { 
  Wallet, 
  Gamepad2, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp,
  Star,
  Trophy,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { data: transactions = [], isLoading: transactionsLoading } = useMemberTransactions(user?.id || '');
  const { data: recharges = [], isLoading: rechargesLoading } = useMemberRecharges(user?.id || '');

  // Calculate stats from real data
  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const gamesPlayed = transactions.filter(t => t.gameId).length;
  const productsBought = transactions.filter(t => !t.gameId).length;
  const totalRecharged = recharges.reduce((sum, recharge) => sum + recharge.amount, 0);

  const stats = [
    {
      title: 'Current Balance',
      value: formatCurrency(user?.balance || 0),
      icon: Wallet,
      color: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
    },
    {
      title: 'Games Played',
      value: gamesPlayed.toString(),
      icon: Gamepad2,
      color: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/10',
    },
    {
      title: 'Products Bought',
      value: productsBought.toString(),
      icon: ShoppingBag,
      color: 'text-accent-tertiary',
      bgColor: 'bg-accent-tertiary/10',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: CreditCard,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
  ];

  // Get recent activities from transactions and recharges
  const recentActivities = [
    ...transactions.slice(0, 3).map(transaction => ({
      type: transaction.gameId ? 'game' : 'product',
      title: transaction.gameId ? 'Game Purchase' : 'Product Purchase',
      amount: transaction.amount,
      date: formatRelativeTime(transaction.date),
      icon: transaction.gameId ? Gamepad2 : ShoppingBag,
    })),
    ...recharges.slice(0, 2).map(recharge => ({
      type: 'recharge',
      title: 'Account Recharged',
      amount: recharge.amount,
      date: formatRelativeTime(recharge.date),
      icon: CreditCard,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  if (transactionsLoading || rechargesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-text-muted mt-2">
          Here's what's happening in your gaming world
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Recent Activity
              </h2>
              <Link 
                to="/transactions"
                className="text-accent-primary hover:text-accent-primary/80 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-bg-tertiary">
                      <div className="p-2 bg-accent-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-accent-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-text-primary font-medium">{activity.title}</p>
                        <p className="text-text-muted text-sm">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-text-primary font-semibold">
                          {formatCurrency(activity.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-muted">No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Recharge */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quick Recharge
            </h3>
            <div className="space-y-3">
              {[25, 50, 100, 200].map((amount) => (
                <Link key={amount} to={`/recharge?amount=${amount}`}>
                  <div className="w-full p-3 text-left rounded-lg border border-border-primary hover:border-accent-primary hover:bg-accent-primary/5 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-text-primary font-medium">
                        ${amount}
                      </span>
                      <CreditCard className="w-4 h-4 text-accent-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/recharge">
              <Button className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Custom Amount
              </Button>
            </Link>
          </Card>

          {/* Quick Navigation */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quick Navigation
            </h3>
            <div className="space-y-3">
              <Link to="/games">
                <Button variant="outline" className="w-full justify-start">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Browse Games
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
              <Link to="/transactions">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Transactions
                </Button>
              </Link>
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-accent-primary/10">
                <Trophy className="w-5 h-5 text-accent-primary" />
                <div>
                  <p className="text-text-primary font-medium">First Purchase</p>
                  <p className="text-text-muted text-sm">
                    {gamesPlayed > 0 || productsBought > 0 ? 'Completed' : 'In Progress'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-bg-tertiary">
                <Star className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-text-primary font-medium">Power Gamer</p>
                  <p className="text-text-muted text-sm">
                    Play {gamesPlayed}/50 games
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
