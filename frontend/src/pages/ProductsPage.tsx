import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { usePurchaseProduct } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';
import { 
  ShoppingBag, 
  Search, 
  Package,
  ShoppingCart,
  Tag
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ProductsPage: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();
  const { user } = useAuth();
  const purchaseProduct = usePurchaseProduct();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.filter(Boolean);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handlePurchase = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedProduct || !user) return;

    try {
      await purchaseProduct.mutateAsync({
        memberId: user.id,
        productId: selectedProduct.id,
        quantity: quantity,
        amount: selectedProduct.price * quantity,
      });
      setShowPurchaseModal(false);
      setSelectedProduct(null);
      setQuantity(1);
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
          <ShoppingBag className="w-8 h-8 text-accent-primary" />
          <h1 className="text-3xl font-bold text-text-primary">Products</h1>
        </div>
        <div className="text-text-muted">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
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
            <option value="category">Sort by Category</option>
            <option value="stock">Stock: High to Low</option>
          </select>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} hover className="flex flex-col">
            <div className="flex-1">
              <div className="aspect-video bg-gradient-to-br from-accent-secondary/20 to-accent-tertiary/20 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-12 h-12 text-accent-secondary" />
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-text-muted text-sm mb-3 line-clamp-3">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-muted capitalize">
                  {product.category.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > 10 
                    ? 'bg-green-500/20 text-green-400' 
                    : product.stock > 0
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {product.tags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.split(',').slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent-primary/10 text-accent-primary text-xs rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-border-primary">
              <div className="text-2xl font-bold text-accent-primary">
                {formatCurrency(product.price)}
              </div>
              <Button
                onClick={() => handlePurchase(product)}
                disabled={product.stock === 0 || !user || user.balance < product.price}
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {product.stock === 0 ? 'Out of Stock' : 'Buy'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No products found
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
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-secondary/20 to-accent-tertiary/20 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-accent-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {selectedProduct.name}
                </h3>
                <p className="text-text-muted capitalize">
                  {selectedProduct.category.replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-text-primary font-medium min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    disabled={quantity >= selectedProduct.stock}
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Max: {selectedProduct.stock} available
                </p>
              </div>
            </div>
            
            <div className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-text-primary">Unit Price:</span>
                <span className="text-text-primary">
                  {formatCurrency(selectedProduct.price)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-text-primary">Quantity:</span>
                <span className="text-text-primary">{quantity}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-text-primary">Total Price:</span>
                <span className="text-xl font-bold text-accent-primary">
                  {formatCurrency(selectedProduct.price * quantity)}
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
                  {formatCurrency((user?.balance || 0) - (selectedProduct.price * quantity))}
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
                loading={purchaseProduct.isPending}
                disabled={!user || user.balance < (selectedProduct.price * quantity)}
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

export default ProductsPage;
