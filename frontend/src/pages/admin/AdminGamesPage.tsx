import React, { useState, useMemo } from 'react';
import { useGames, useCreateGame, useUpdateGame, useDeleteGame } from '../../hooks/useGames';
import { formatCurrency } from '../../utils/formatters';
import { 
  Gamepad2, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Game } from '../../types';

const AdminGamesPage: React.FC = () => {
  const { data: games = [], isLoading } = useGames();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  // Get unique genres and statuses
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(games.map(game => game.genre))];
    return uniqueGenres.filter(Boolean);
  }, [games]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(games.map(game => game.status))];
    return uniqueStatuses.filter(Boolean);
  }, [games]);

  // Filter games
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || game.genre === selectedGenre;
      const matchesStatus = !selectedStatus || game.status === selectedStatus;
      
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [games, searchTerm, selectedGenre, selectedStatus]);

  const handleCreate = () => {
    setEditingGame(null);
    setShowModal(true);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowModal(true);
  };

  const handleDelete = (game: Game) => {
    setGameToDelete(game);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (gameToDelete) {
      await deleteGame.mutateAsync(gameToDelete.id);
      setShowDeleteConfirm(false);
      setGameToDelete(null);
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
          <h1 className="text-3xl font-bold text-text-primary">Manage Games</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Game
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>

          <div className="text-text-muted text-sm flex items-center">
            {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </Card>

      {/* Games Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left p-4 text-text-primary font-semibold">Game</th>
                <th className="text-left p-4 text-text-primary font-semibold">Genre</th>
                <th className="text-left p-4 text-text-primary font-semibold">Price</th>
                <th className="text-left p-4 text-text-primary font-semibold">Status</th>
                <th className="text-left p-4 text-text-primary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => (
                <tr key={game.id} className="border-b border-border-primary hover:bg-bg-tertiary/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-6 h-6 text-accent-primary" />
                      </div>
                      <div>
                        <h3 className="text-text-primary font-medium">{game.name}</h3>
                        <p className="text-text-muted text-sm line-clamp-1">{game.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-text-muted capitalize">{game.genre}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-text-primary font-semibold">{formatCurrency(game.price)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : game.status === 'coming_soon'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {game.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(game)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(game)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No games found
            </h3>
            <p className="text-text-muted">
              {searchTerm || selectedGenre || selectedStatus
                ? 'Try adjusting your search or filter criteria'
                : 'No games have been created yet'
              }
            </p>
          </div>
        )}
      </Card>

      {/* Game Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingGame ? 'Edit Game' : 'Add New Game'}
        size="lg"
      >
        <GameForm
          game={editingGame}
          onClose={() => setShowModal(false)}
          onSave={async (gameData) => {
            if (editingGame) {
              await updateGame.mutateAsync({ id: editingGame.id, game: gameData });
            } else {
              await createGame.mutateAsync(gameData);
            }
            setShowModal(false);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Game"
      >
        {gameToDelete && (
          <div className="space-y-4">
            <p className="text-text-primary">
              Are you sure you want to delete <strong>{gameToDelete.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                loading={deleteGame.isPending}
                className="flex-1"
              >
                Delete Game
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Game Form Component
interface GameFormProps {
  game?: Game | null;
  onClose: () => void;
  onSave: (gameData: Partial<Game>) => void;
}

const GameForm: React.FC<GameFormProps> = ({ game, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: game?.name || '',
    description: game?.description || '',
    price: game?.price || 0,
    genre: game?.genre || '',
    status: game?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Game Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Genre
          </label>
          <select
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select Genre</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="rpg">RPG</option>
            <option value="strategy">Strategy</option>
            <option value="simulation">Simulation</option>
            <option value="sports">Sports</option>
            <option value="racing">Racing</option>
            <option value="puzzle">Puzzle</option>
            <option value="arcade">Arcade</option>
            <option value="fighting">Fighting</option>
          </select>
        </div>

        <Input
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          min="0"
          step="0.01"
          required
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="input-field"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field min-h-[100px] resize-none"
          placeholder="Enter game description..."
          required
        />
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          {game ? 'Update Game' : 'Create Game'}
        </Button>
      </div>
    </form>
  );
};

export default AdminGamesPage;
