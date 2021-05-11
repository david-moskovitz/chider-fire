import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute'
import Screen from './components/Screen'
import Admin from './components/Admin'
import LogIn from './components/LogIn'
import AddDafCSV from './components/AddDafCSV'
import {auth} from './firebase'
import {AuthProvider} from './utils/AuthContext'

export const Auth = React.createContext<any>(auth)


function App() {


  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path='/screen'>
            <Screen />
          </Route>
          <Route path='/login'>
            <LogIn />
          </Route>
          <PrivateRoute
            path='/admin'
            component={Admin}
          />
          <PrivateRoute
            path='/import'
            component={AddDafCSV}
          />
          <PrivateRoute
            path='/'
            component={Admin}
          />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
