import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, Plus, AlertCircle } from 'lucide-react';
import instance from '../../../../config/Axios';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nom_produit: '',
    category_id: '',
    description: '',
    prix: '',
    image_produit: null,
  });
  const [editProduct, setEditProduct] = useState({
    id: '',
    nom_produit: '',
    category_id: '',
    prix: '',
    image_produit: null,
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category_id = selectedCategory;

        const response = await instance.get('/products/table', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params,
        });
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get('/products/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle form input changes for add form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({
        ...prev,
        image_produit: { file, preview: URL.createObjectURL(file) },
      }));
    }
  };

  const handleFileEditChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProduct((prev) => ({
        ...prev,
        image_produit: { file, preview: URL.createObjectURL(file) },
      }));
    }
  };

  // Handle form input changes for edit form
  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle add product submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newProduct.image_produit) {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(newProduct.image_produit.file);
      });

      newProduct.image_produit = {
        name: newProduct.image_produit.file.name,
        data: base64Image
      };
    } else {
      newProduct.image_produit = {
        name: null,
        data: null
      };
    }
    try {
      const response = await instance.post('/products/add', newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setProducts((prev) => ([...prev, response.data.data]))
      setShowAddForm(false);
      setNewProduct({
        nom_produit: '',
        category_id: '',
        prix: '',
        description: '',
        image_produit: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get category id by name
  const getCategoryIdByName = (categoryName, categories) => {
    if (!categoryName || !categories?.length) {
      return null;
    }
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : null;
  };

  // Handle modify product
  const handleModifieProduct = (product) => {
    setEditProduct({
      id: product.id,
      nom_produit: product.name,
      category_id: getCategoryIdByName(product.category, categories),
      prix: product.price,
      image_produit: null,
    });
    setShowEditForm(true);
  };

  // Handle edit product submission
  const handleEditProductSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

    if (editProduct.image_produit) {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(editProduct.image_produit.file);
      });

      editProduct.image_produit = {
        name: editProduct.image_produit.file.name,
        data: base64Image
      };
    } else {
      editProduct.image_produit = {
        name: null,
        data: null
      };
    }
    try {
      const response = await instance.put(`/products/update/${editProduct.id}`, editProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? response.data.data : p))
      );
      setShowEditForm(false);
      setEditProduct({
        id: null,
        nom_produit: '',
        category_id: '',
        prix: '',
        image_produit: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await instance.delete(`/products/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-sm h-[480px] sm:h-[420px]"
        role="status"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(254,175,48,0.05))',
        }}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        aria-label="Loading product table"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FEAF30]"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-sm h-[480px] sm:h-[420px]"
        role="alert"
        style={{
          background: 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(254,175,48,0.05))',
        }}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        aria-label="Error loading data"
      >
        <AlertCircle size={40} KaisName="mb-2 text-[#FEAF30]" />
        <p className="text-lg font-semibold text-gray-900">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Liste des Produits</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              className="bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEAF30] transition"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
          <select
            className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEAF30] transition"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value={""}>Toutes les Catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#FEAF30] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#FEA000] flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Ajouter un Produit
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <motion.div
          className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un nouveau Produit</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">Nom</label>
              <input
                type="text"
                name="nom_produit"
                value={newProduct.nom_produit}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Catégorie</label>
              <select
                name="category_id"
                value={newProduct.category_id}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              >
                <option value="">Sélectionner une Catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-700">Prix (GNF)</label>
              <input
                type="number"
                name="prix"
                value={newProduct.prix}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Image</label>
              <input
                type="file"
                id='image_produit'
                name="image_produit"
                onChange={handleFileChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                accept="image/png, image/jpeg, image/jpg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-gray-700">Description</label>
              <textarea 
                name="description" 
                id="description" 
                value={newProduct.description}
                className="w-full resize-y min-h-32 bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                onChange={handleInputChange}>
              </textarea>
            </div>
            <div className="sm:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-[#FEAF30] text-white px-4 py-2 rounded-lg hover:bg-[#FEA000] transition"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Edit Product Form */}
      {showEditForm && (
        <motion.div
          className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier le Produit</h3>
          <form onSubmit={handleEditProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">Nom</label>
              <input
                type="text"
                name="nom_produit"
                value={editProduct.nom_produit}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Catégorie</label>
              <select
                name="category_id"
                value={editProduct.category_id}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              >
              <option value={""}>Toutes les Catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} name="category_id">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-700">Prix (GNF)</label>
              <input
                type="number"
                name="prix"
                value={editProduct.prix}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                step="0.01"
                required
              />
            </div>
            <div className="">
              <label className="text-gray-700">Image (laisser vide pour conserver l'image actuelle)</label>
              <input
                type="file"
                name="image_produit"
                onChange={handleFileEditChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                accept="image/*"
              />
            </div>
            <div className="sm:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-[#FEAF30] text-white px-4 py-2 rounded-lg hover:bg-[#FEA000] transition"
              >
                Mettre à jour
              </button>
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex gap-2 items-center">
                  <img src={product.image} alt={product.name} className="size-10 rounded-full" />
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.price} GNF</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.sales}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleModifieProduct(product)}
                    className="text-[#FEAF30] hover:text-[#FEA000] mr-2 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default ProductTable;