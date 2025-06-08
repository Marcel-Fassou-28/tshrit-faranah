import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  let isAuthenticated = false;
  let userRole = null;
  try {
    const parsedUser = user ? JSON.parse(user) : null;
    isAuthenticated = token && parsedUser && parsedUser.id;
    userRole = parsedUser?.role || null;
  } catch (error) {
    console.error('Erreur lors de l\'analyse des données utilisateur :', error);
  }

  if (!isAuthenticated) {
    return <Navigate to="/login"  />;
  }

  // Si allowedRoles est spécifié, vérifier si le rôle de l'utilisateur est autorisé
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ error: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page' }}
      />
    );
  }
  return children;
};

export default ProtectedRoute;