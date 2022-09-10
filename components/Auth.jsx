import { useSession } from 'next-auth/react';

const Auth = ({ children }) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => (window.location.href = '/'),
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
};

export default Auth;
