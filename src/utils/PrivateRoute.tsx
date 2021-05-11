import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom';
import {useAuth} from '../utils/AuthContext'


const PrivateRoute:React.FC<any> = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}
    ></Route>
  )
}

export default PrivateRoute
