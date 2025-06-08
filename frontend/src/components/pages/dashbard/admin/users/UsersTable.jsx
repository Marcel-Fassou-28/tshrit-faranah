import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, AlertCircle, Plus } from 'lucide-react';
import instance from '../../../../config/Axios';

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false)
  const [addUser, setAddUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: '',
    password: '',
  })
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUser, setEditUser] = useState({
    id: null,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: '',
    password: '',
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedRole) params.role = selectedRole;

        const response = await instance.get('/users/table', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params,
        });
        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, selectedRole]);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await instance.get('/users/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load roles:', err);
      }
    };

    fetchRoles();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role filter
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle modify user
  const handleModifieUser = (user) => {
    setEditUser({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      password: '',
    });
    setShowEditForm(true);
  };

  // Handle edit user submission
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nom: editUser.nom,
        prenom: editUser.prenom,
        email: editUser.email,
        telephone: editUser.telephone,
        role: editUser.role,
      };
      if (editUser.password) {
        payload.password = editUser.password;
      }

      const response = await instance.put(`/users/${editUser.id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? response.data.data : u))
      );
      setShowEditForm(false);
      setEditUser({
        id: null,
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await instance.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-sm h-[400px]"
        role="status"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(254,25,48,0.2))',
        }}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        aria-label="Loading users table"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FEAF30]"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-sm h-[400px]"
        role="alert"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(254,25,48,0.2))',
        }}
        variants={chartVariants}
        initial="visible"
        animate="visible"
        aria-label="Error loading data"
      >
        <AlertCircle className="mb-4 text-[#FEAF30]" size={40} />
        <p className="text-lg font-semibold text-gray-800">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-6 border border-gray-900 mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between mb-6 items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Liste des Utilisateurs</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              className="bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEAF30] transition"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
          <select
            className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEAF30] transition"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="">Tous les rôles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
            <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#FEAF30] text-white px-4 py-2 rounded-lg hover:bg-[#FEA000] flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Ajouter un Utilisateur
          </button>
        </div>
      </div>

      {showAddForm && (
        <motion.div
          className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier l'Utilisateur</h3>
          <form onSubmit={handleEditUserSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={addUser.nom}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={addUser.prenom}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={addUser.email}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Téléphone</label>
              <input
                type="text"
                name="telephone"
                value={addUser.telephone}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Rôle</label>
              <select
                name="role"
                value={addUser.role}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              >
                <option value="">Sélectionner un rôle</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-700">Mot de passe (laisser vide pour ne pas modifier)</label>
              <input
                type="password"
                name="password"
                value={addUser.password}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                placeholder="Nouveau mot de passe"
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

      {/* Edit User Form */}
      {showEditForm && (
        <motion.div
          className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier l'Utilisateur</h3>
          <form onSubmit={handleEditUserSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={editUser.nom}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={editUser.prenom}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Téléphone</label>
              <input
                type="text"
                name="telephone"
                value={editUser.telephone}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              />
            </div>
            <div>
              <label className="text-gray-700">Rôle</label>
              <select
                name="role"
                value={editUser.role}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              >
                <option value="">Sélectionner un rôle</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-700">Mot de passe (laisser vide pour ne pas modifier)</label>
              <input
                type="password"
                name="password"
                value={editUser.password}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:ring-2 focus:ring-[#FEAF30] transition"
                placeholder="Nouveau mot de passe"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.prenom} {user.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.telephone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.created_at}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleModifieUser(user)}
                    className="text-[#FEAF30] hover:text-[#FEA000] mr-2 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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

export default UsersTable;
