import { useRouter } from 'next/navigation';
import { NextPage } from 'next';
import { useEffect } from 'react';

type ComponentType = NextPage<any>; // Adjust the type according to your component's props

function AuthGuard(Component: ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    useEffect(() => {
      // Check authentication status
      const isAuthenticated = localStorage.getItem('access_token');
      
      // If not authenticated, redirect to login page
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, [router]);

    return <Component {...props} />;
  };
}

export default AuthGuard;
