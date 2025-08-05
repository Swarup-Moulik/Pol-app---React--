// PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const { t } = useTranslation('profile');
  const { toast } = useToast();
  if (!token) {
    toast({
        title: t("login_required"),
        variant: "destructive"
    }); 
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
