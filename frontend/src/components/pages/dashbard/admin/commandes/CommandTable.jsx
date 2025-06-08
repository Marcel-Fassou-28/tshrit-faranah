import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import instance from '../../../../config/Axios';

function CommandTable() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([
    { id: 1, name: 'en attente', displayName: 'En attente' },
    { id: 2, name: 'payé', displayName: 'Payé' },
    { id: 3, name: 'annulé', displayName: 'Annulé' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editOrder, setEditOrder] = useState({ id: null, statut: '' });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedStatus) params.status = selectedStatus; // Use 'status' for backend

        const response = await instance.get('/commands/table', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params,
        });

        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
        } else {
          throw new Error('Invalid response format');
        }
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Échec du chargement des commandes.';
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchTerm, selectedStatus]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle modify order
  const handleModifyOrder = (order) => {
    setEditOrder({
      id: order.id,
      statut: order.status, // Use 'status' from backend response
    });
    setShowEditForm(true);
  };

  // Handle edit order submission
  const handleEditOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.put(`/commands/${editOrder.id}`, {
        statut: editOrder.statut,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.statut === 'success') {
        setOrders((prev) =>
          prev.map((o) => (o.id === editOrder.id ? response.data.data : o))
        );
        setShowEditForm(false);
        setEditOrder({ id: null, statut: '' });
        toast.success('Commande mise à jour avec succès !');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec de la mise à jour de la commande.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }

    try {
      await instance.delete(`/commands/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Commande supprimée avec succès !');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Échec de la suppression de la commande.';
      setError(errorMessage);
      toast.error(errorMessage);
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
        aria-label="Chargement du tableau des commandes"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FEAF30]"></div>
        <p className="mt-2 text-gray-700">Chargement...</p>
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
        aria-label="Erreur de chargement des données"
      >
        <AlertCircle size={40} className="mb-2 text-red-600" />
        <p className="text-lg font-semibold text-gray-900">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-[#FEAF30] hover:text-[#FEA000] transition"
        >
          Réessayer
        </button>
      </motion.div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center border border-gray-200 rounded-xl shadow-sm h-[480px] sm:h-[420px]"
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        aria-label="Aucune commande trouvée"
      >
        <p className="text-lg font-semibold text-gray-900">Aucune commande trouvée</p>
        <p className="text-gray-700">Essayez de modifier les filtres ou ajoutez une nouvelle commande.</p>
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
        <h2 className="text-xl font-semibold text-gray-900">Liste des Commandes</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par ID ou client..."
              className="bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEAF30] transition"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          </div>
          <select
            className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FEAF30] transition"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="">Tous les Statuts</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.name}>
                {status.displayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Edit Order Form */}
      {showEditForm && (
        <motion.div
          className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier la Commande</h3>
          <form onSubmit={handleEditOrderSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-gray-700">Statut</label>
              <select
                name="statut"
                value={editOrder.statut}
                onChange={handleEditInputChange}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[#FEAF30] transition"
                required
              >
                <option value="">Sélectionner un Statut</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.name}>
                    {status.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(order.order_date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.total} GNF</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {statuses.find((s) => s.name === order.statut)?.displayName || order.statut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleModifyOrder(order)}
                    className="text-[#FEAF30] hover:text-[#FEA000] mr-2 transition"
                    aria-label={`Modifier la commande ${order.id}`}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    aria-label={`Supprimer la commande ${order.id}`}
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

export default CommandTable;