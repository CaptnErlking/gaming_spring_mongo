import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { useMemberTransactions, useMemberRecharges } from '../hooks';
import { formatCurrency, formatDateTime, formatPhoneNumber } from '../utils/formatters';
import { memberSchema } from '../utils/validators';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Wallet,
  Edit3,
  Save,
  X,
  Crown,
  CheckCircle
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const { data: transactions = [] } = useMemberTransactions(user?.id || '');
  const { data: recharges = [] } = useMemberRecharges(user?.id || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(memberSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const onSubmit = async (data: any) => {
    // In a real app, this would update the user profile
    console.log('Profile update:', data);
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // Calculate stats
  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalRecharged = recharges.reduce((sum, recharge) => sum + recharge.amount, 0);
  const gamesPlayed = transactions.filter(t => t.gameId).length;
  const productsBought = transactions.filter(t => !t.gameId).length;

  if (!user) {
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
          <User className="w-8 h-8 text-accent-primary" />
          <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
        </div>
        <div className="flex items-center space-x-2">
          {user.role === 'ADMIN' && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-accent-secondary/20 text-accent-secondary rounded-full text-sm font-medium">
              <Crown className="w-4 h-4" />
              <span>Admin</span>
            </div>
          )}
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'outline' : 'primary'}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="border-green-500 bg-green-500/10">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-green-400 font-semibold">Profile Updated!</h3>
              <p className="text-text-muted">
                Your profile has been updated successfully
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Personal Information
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  disabled={!isEditing}
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  {...register('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  disabled={!isEditing}
                />
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Account Type
                  </label>
                  <div className="p-3 bg-bg-tertiary rounded-lg">
                    <div className="flex items-center space-x-2">
                      {user.role === 'ADMIN' ? (
                        <Crown className="w-4 h-4 text-accent-secondary" />
                      ) : (
                        <User className="w-4 h-4 text-accent-primary" />
                      )}
                      <span className="text-text-primary font-medium capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4 border-t border-border-primary">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Account Stats */}
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Account Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary mb-1">
                  {formatCurrency(user.balance || 0)}
                </div>
                <div className="text-text-muted text-sm">Current Balance</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-secondary mb-1">
                  {gamesPlayed}
                </div>
                <div className="text-text-muted text-sm">Games Played</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-tertiary mb-1">
                  {productsBought}
                </div>
                <div className="text-text-muted text-sm">Products Bought</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {transactions.length}
                </div>
                <div className="text-text-muted text-sm">Total Purchases</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary */}
          <Card glow>
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-8 h-8 text-accent-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Account Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Member Since:</span>
                <span className="text-text-primary">
                  {user.joiningDate ? formatDateTime(user.joiningDate) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Spent:</span>
                <span className="text-text-primary font-semibold">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Recharged:</span>
                <span className="text-text-primary font-semibold">
                  {formatCurrency(totalRecharged)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                  <div>
                    <div className="text-text-primary font-medium text-sm">
                      {transaction.gameId ? 'Game Purchase' : 'Product Purchase'}
                    </div>
                    <div className="text-text-muted text-xs">
                      {formatDateTime(transaction.date)}
                    </div>
                  </div>
                  <div className="text-accent-primary font-semibold">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-text-muted text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Wallet className="w-4 h-4 mr-2" />
                Recharge Account
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                View Transactions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
