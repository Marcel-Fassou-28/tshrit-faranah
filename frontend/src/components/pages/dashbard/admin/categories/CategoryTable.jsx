import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, Plus, AlertCircle } from 'lucide-react';
import instance from '../../../../config/Axios';

function CategoryTable() {
    const [Categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [newCategory, setNewCategory] = useState({
        nom_categorie: '',
        description: '',
        photo: null,
      })

    const [editCategory, setEditCategory] = useState({
        id: '',
        nom_categorie: '',
        description: '',
        photo: null,
      })
    
      useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get('/categorie/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

    const handleFileCategoryChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory((prev) => ({
        ...prev,
        photo: { file, preview: URL.createObjectURL(file) },
      }));
    }
  }

   const handleInputChangeCategory = (e) => {
    const { name, value, files } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  const handleModifieCategory = (category) => {
    setEditCategory({
      id: category.id,
      nom_categorie: category.nom_categorie,
      photo: null,
      description: category.description
    });
    setShowEditCategoryForm(true);
  }

  const handleDeleteCategory = async (id) => {
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await instance.delete(`/categorie/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  }

   const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newCategory.photo) {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(newCategory.photo.file);
      });

      newCategory.photo = {
        name: newCategory.photo.file.name,
        data: base64Image
      };
    } else {
      newCategory.photo = {
        name: null,
        data: null
      };
    }
    try {
      const response = await instance.post('/categorie/add', newCategory, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setShowAddCategoryForm(false);
      setCategories((prev) => ([...prev, response.data.data]));
      setNewCategory({
        nom_categorie: '',
        description: '',
        photo: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editCategory.photo) {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(editCategory.photo.file);
      });

      editCategory.photo = {
        name: editCategory.photo.file.name,
        data: base64Image
      };
    } else {
      editCategory.photo = {
        name: null,
        data: null
      };
    }

    try {
      const response = await instance.put(`/categorie/update/${editProduct.id}`, editProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setProducts((prev) =>
        prev.map((c) => (c.id === editCategory.id ? response.data.data : c))
      );
      setShowEditForm(false);
      setEditCategory({
        id: '',
        nom_categorie: '',
        description: '',
        photo: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  }

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
            aria-label="Loading category table"
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
              background: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(254,175,48,0.05))',
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
              <button
                onClick={() => setShowAddCategoryForm(true)}
                className="bg-[#FEAF30] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#FEA000] flex items-center gap-2 transition"
              >
                <Plus size={18} />
                Ajouter une Categorie
              </button>
            </div>
          </div>
    
          {/* Add category Form */}
          {showAddCategoryForm && (
            <motion.div
              className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une Nouvelle Categorie</h3>
              <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="nom_categorie"
                    value={newCategory.nom_categorie}
                    onChange={handleInputChangeCategory}
                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-700">Image</label>
                  <input
                    type="file"
                    id='photo'
                    name="photo"
                    onChange={handleFileCategoryChange}
                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-gray-700">Description</label>
                  <textarea 
                    name="description" 
                    id="description" 
                    value={newCategory.description}
                    className="w-full resize-y min-h-32 bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                    onChange={handleInputChangeCategory}>
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
                    onClick={() => setShowAddCategoryForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          )}
    
          {/* Edit category Form */}
          {showEditCategoryForm && (
            <motion.div
              className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une Nouvelle Categorie</h3>
              <form onSubmit={handleEditCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="nom_categorie"
                    value={editCategory.nom_categorie}
                    onChange={handleInputChangeCategory}
                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-700">Image</label>
                  <input
                    type="file"
                    id='photo'
                    name="photo"
                    onChange={handleFileCategoryChange}
                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-gray-700">Description</label>
                  <textarea 
                    name="description" 
                    id="description" 
                    value={editCategory.description}
                    className="w-full resize-y min-h-32 bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                    onChange={handleInputChangeCategory}>
                  </textarea>
                </div>
                <div className="sm:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="bg-[#FEAF30] text-white px-4 py-2 rounded-lg hover:bg-[#FEA000] transition"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditCategoryForm(false)}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-xs text-center font-medium text-gray-500 uppercase tracking-wider">Nombre de Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Categories.map((category) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category.nom_categorie}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex gap-2 items-center">
                      <img src={category.photo} alt={category.nom_categorie} className="size-10 rounded-full" />
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{category.products_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleModifieCategory(category)}
                        className="text-[#FEAF30] hover:text-[#FEA000] mr-2 transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
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
  )
}

export default CategoryTable
