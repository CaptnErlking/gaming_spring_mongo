import React, { useState, useMemo } from 'react';
import { useGames } from '../hooks/useGames';
import { useAuth } from '../contexts/AuthContext';
import { usePurchaseGame } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';
import { 
  Gamepad2, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart,
  Loader2
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const GamesPage: React.FC = () => {
  const { data: games = [], isLoading } = useGames();
  const { user } = useAuth();
  const purchaseGame = usePurchaseGame();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);

  // Get unique genres and statuses
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(games.map(game => game.genre))];
    return uniqueGenres.filter(Boolean);
  }, [games]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(games.map(game => game.status))];
    return uniqueStatuses.filter(Boolean);
  }, [games]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || game.genre === selectedGenre;
      const matchesStatus = !selectedStatus || game.status === selectedStatus;
      
      return matchesSearch && matchesGenre && matchesStatus;
    });

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'genre':
          return a.genre.localeCompare(b.genre);
        default:
          return 0;
      }
    });

    return filtered;
  }, [games, searchTerm, selectedGenre, selectedStatus, sortBy]);

  const handlePurchase = (game: any) => {
    setSelectedGame(game);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedGame || !user) return;

    try {
      await purchaseGame.mutateAsync({
        memberId: user.id,
        gameId: selectedGame.id,
        amount: selectedGame.price,
      });
      setShowPurchaseModal(false);
      setSelectedGame(null);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
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
          <Gamepad2 className="w-8 h-8 text-accent-primary" />
          <h1 className="text-3xl font-bold text-text-primary">Games</h1>
        </div>
        <div className="text-text-muted">
          {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="input-field"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="genre">Sort by Genre</option>
          </select>
        </div>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <Card key={game.id} hover className="flex flex-col">
            <div className="flex-1">
              <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-accent-primary" />
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                {game.name}
              </h3>
              
              <p className="text-text-muted text-sm mb-3 line-clamp-3">
                {game.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-muted capitalize">
                  {game.genre}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  game.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : game.status === 'coming_soon'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {game.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border-primary">
              <div className="text-2xl font-bold text-accent-primary">
                {formatCurrency(game.price)}
              </div>
              <Button
                onClick={() => handlePurchase(game)}
                disabled={game.status !== 'active' || !user || user.balance < game.price}
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {game.status !== 'active' ? 'Coming Soon' : 'Buy'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No games found
            </h3>
            <p className="text-text-muted">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </Card>
      )}

      {/* Purchase Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Confirm Purchase"
      >
        {selectedGame && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-accent-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {selectedGame.name}
                </h3>
                <p className="text-text-muted">{selectedGame.genre}</p>
              </div>
            </div>
            
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-text-primary">Price:</span>
                <span className="text-xl font-bold text-accent-primary">
                  {formatCurrency(selectedGame.price)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-text-primary">Your Balance:</span>
                <span className="text-text-primary">
                  {formatCurrency(user?.balance || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-border-primary">
                <span className="text-text-primary font-semibold">Remaining Balance:</span>
                <span className="text-text-primary font-semibold">
                  {formatCurrency((user?.balance || 0) - selectedGame.price)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPurchase}
                loading={purchaseGame.isPending}
                disabled={!user || user.balance < selectedGame.price}
                className="flex-1"
              >
                Confirm Purchase
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GamesPage;
