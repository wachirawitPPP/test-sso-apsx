"use client"
import { useEffect, useState } from 'react';
import { getAccessToken, isTokenExpired, refreshAccessToken } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      let token = getAccessToken();
      if (!token || isTokenExpired(token)) {
        token = await refreshAccessToken();
      }
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('auth/auth1/login');
      }
    };
    checkAuthentication();
  }, [router]);

  if (!isAuthenticated) {
    return <div></div>
  }

  return <>{children}</>;
};

export default ProtectedRoute;
