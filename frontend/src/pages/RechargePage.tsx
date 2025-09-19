import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { useCreateRecharge, useMemberRecharges } from '../hooks/useRecharges';
import { rechargeSchema } from '../utils/validators';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { 
  CreditCard, 
  Wallet, 
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const RechargePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, updateBalance } = useAuth();
  const createRecharge = useCreateRecharge();
  const { data: recharges = [], isLoading } = useMemberRecharges(user?.id || '');
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rechargeSchema),
  });

  const customAmount = watch('amount');

  // Pre-fill amount from URL params
  useEffect(() => {
    const amount = searchParams.get('amount');
    if (amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        setSelectedAmount(numAmount);
        setValue('amount', numAmount);
      }
    }
  }, [searchParams, setValue]);

  const quickAmounts = [25, 50, 100, 200, 500];

  const onSubmit = async (data: any) => {
    if (!user) return;

    try {
      const recharge = await createRecharge.mutateAsync({
        memberId: user.id,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
      });

      // Update user balance in context
      updateBalance((user.balance || 0) + data.amount);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Recharge failed:', error);
    }
  };

  const totalRecharged = recharges.reduce((sum, recharge) => sum + recharge.amount, 0);
  const recentRecharges = recharges.slice(0, 5);

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
      <div className="flex items-center space-x-3">
        <CreditCard className="w-8 h-8 text-accent-primary" />
        <h1 className="text-3xl font-bold text-text-primary">Recharge Account</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharge Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Add Funds to Your Account
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Quick Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Quick Amount Selection
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setValue('amount', amount);
                      }}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        selectedAmount === amount
                          ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                          : 'border-border-primary hover:border-accent-primary/50 hover:bg-accent-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{amount}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Or enter custom amount
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  {...register('amount')}
                  error={errors.amount?.message}
                  min="1"
                  max="10000"
                  step="0.01"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Payment Method
                </label>
                <select
                  {...register('paymentMethod')}
                  className="input-field"
                >
                  <option value="">Select payment method</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={createRecharge.isPending}
                disabled={!customAmount || customAmount <= 0}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Recharge Account
              </Button>
            </form>
          </Card>

          {/* Success Message */}
          {showSuccess && (
            <Card className="border-green-500 bg-green-500/10">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-green-400 font-semibold">Recharge Successful!</h3>
                  <p className="text-text-muted">
                    Your account has been recharged with {formatCurrency(customAmount || 0)}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Balance */}
          <Card glow>
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-8 h-8 text-accent-primary" />
              <h3 className="text-lg font-semibold text-text-primary">Current Balance</h3>
            </div>
            <div className="text-3xl font-bold text-accent-primary mb-2">
              {formatCurrency(user?.balance || 0)}
            </div>
            <p className="text-text-muted text-sm">
              Available for purchases
            </p>
          </Card>

          {/* Recharge Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Recharge History
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Total Recharged:</span>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(totalRecharged)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Total Recharges:</span>
                <span className="font-semibold text-text-primary">
                  {recharges.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Average Amount:</span>
                <span className="font-semibold text-text-primary">
                  {recharges.length > 0 
                    ? formatCurrency(totalRecharged / recharges.length)
                    : formatCurrency(0)
                  }
                </span>
              </div>
            </div>
          </Card>

          {/* Recent Recharges */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Recent Recharges
            </h3>
            <div className="space-y-3">
              {recentRecharges.length > 0 ? (
                recentRecharges.map((recharge) => (
                  <div key={recharge.id} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                    <div>
                      <div className="text-text-primary font-medium">
                        {formatCurrency(recharge.amount)}
                      </div>
                      <div className="text-text-muted text-sm">
                        {formatDateTime(recharge.date)}
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted text-sm">No recharges yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;
