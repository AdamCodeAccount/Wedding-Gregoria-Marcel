import React from 'react';
import { Route, Switch } from 'wouter';
import BlackGoldPremium from './components/BlackGoldPremium';
import AdminPage from './pages/Admin';

function App() {
  return (
    <Switch>
      <Route path="/" component={BlackGoldPremium} />
      <Route path="/admin-secret-2026" component={AdminPage} />
    </Switch>
  );
}

export default App; 