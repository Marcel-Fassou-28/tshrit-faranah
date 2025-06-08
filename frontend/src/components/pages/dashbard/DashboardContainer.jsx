import { Navigate, useParams } from 'react-router-dom';
import DashboardAdmin from './admin/DashboardAdmin';


const DashboardContainer = () => {
  const { role } = useParams(); // Récupère le paramètre :role de l'URL
  const user = localStorage.getItem('user');
  let userRole = null;

  try {
    const parsedUser = user ? JSON.parse(user) : null;
    userRole = parsedUser?.role || null;
  } catch (error) {
    console.error('Erreur lors de l\'analyse des données utilisateur :', error);
  }

  if (role !== userRole) {
    return <Navigate to="/" replace state={{ error: 'accès non autorisé pour cette page' }} />;
  }

  if (userRole === 'admin') {
    return <DashboardAdmin />;
  } else {
    return <Navigate to="/" replace state={{ error: 'Accès non autorisé' }} />;
  }
};

export default DashboardContainer
