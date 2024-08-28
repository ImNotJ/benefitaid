import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Log in</button>
      )}
      {isAuthenticated && (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      )}
    </div>
  );
};

export default App;