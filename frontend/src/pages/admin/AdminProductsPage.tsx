import React, { useState, useMemo } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatters';
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Package
} from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Product } from '../../types';

const AdminProductsPage: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.filter(Boolean);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct.mutateAsync(productToDelete.id);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
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
          <h1 className="text-3xl font-bold text-text-primary">Manage Products</h1>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
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

          <div className="text-text-muted text-sm flex items-center">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left p-4 text-text-primary font-semibold">Product</th>
                <th className="text-left p-4 text-text-primary font-semibold">Category</th>
                <th className="text-left p-4 text-text-primary font-semibold">Price</th>
                <th className="text-left p-4 text-text-primary font-semibold">Stock</th>
                <th className="text-left p-4 text-text-primary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-border-primary hover:bg-bg-tertiary/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-secondary/20 to-accent-tertiary/20 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-accent-secondary" />
                      </div>
                      <div>
                        <h3 className="text-text-primary font-medium">{product.name}</h3>
                        <p className="text-text-muted text-sm line-clamp-1">{product.description}</p>
                        {product.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.tags.split(',').slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 bg-accent-primary/10 text-accent-primary text-xs rounded"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-text-muted capitalize">
                      {product.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-text-primary font-semibold">{formatCurrency(product.price)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10 
                        ? 'bg-green-500/20 text-green-400' 
                        : product.stock > 0
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product)}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No products found
            </h3>
            <p className="text-text-muted">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filter criteria'
                : 'No products have been created yet'
              }
            </p>
          </div>
        )}
      </Card>

      {/* Product Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSave={async (productData) => {
            if (editingProduct) {
              await updateProduct.mutateAsync({ id: editingProduct.id, product: productData });
            } else {
              await createProduct.mutateAsync(productData);
            }
            setShowModal(false);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Product"
      >
        {productToDelete && (
          <div className="space-y-4">
            <p className="text-text-primary">
              Are you sure you want to delete <strong>{productToDelete.name}</strong>? 
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
                loading={deleteProduct.isPending}
                className="flex-1"
              >
                Delete Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Product Form Component
interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    tags: product?.tags || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select Category</option>
            <option value="gaming_accessories">Gaming Accessories</option>
            <option value="electronics">Electronics</option>
            <option value="merchandise">Merchandise</option>
            <option value="software">Software</option>
            <option value="hardware">Hardware</option>
            <option value="collectibles">Collectibles</option>
            <option value="apparel">Apparel</option>
            <option value="books">Books</option>
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

        <Input
          label="Stock Quantity"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Tags (comma-separated)
        </label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="e.g., gaming, wireless, premium"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field min-h-[100px] resize-none"
          placeholder="Enter product description..."
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
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default AdminProductsPage;
