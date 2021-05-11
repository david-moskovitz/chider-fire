import React from 'react'

import { useHistory} from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import logo from '../images/logo.png'
import {useAuth} from '../utils/AuthContext'


const LogIn:React.FC = () => {

  const { login } = useAuth()
  let history = useHistory();
  
  const [username, setUsername] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<any>(localStorage.getItem('error'))
  const [errorFor, setErrorFor] = React.useState<any>(localStorage.getItem('errorFor'))
  
 
  // sets error in local storage to prevent a reset when component mounts
  React.useEffect(() => {
    if (!!error) {
      localStorage.setItem('error', error)
    }
    if (!!errorFor) {
      localStorage.setItem('errorFor', errorFor)
    }
  }, [error, errorFor])


  // clear local storage on first load
  React.useEffect(() => {
    localStorage.clear()
  }, [])

  const handleSubmit = async (event:any) => {
    event.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setErrorFor('username')
        setError('username not found')
      } else if (err.code === 'auth/wrong-password') {
        setErrorFor('password')
        setError('password incorrect')
      }
      setLoading(false)
    }
    history.push('/admin')
  }

  return (
    <div className="log-in-page">
      
      <Card raised style={{width:'400px', display:'flex', alignItems:'center', flexDirection:'column'}}>
        {loading ?
          <div style={{backgroundColor: 'red', width: '400px'}}>
            <LinearProgress />
          </div>
        : null}
        <form onSubmit={handleSubmit} style={{width:'300px'}}>
          <CardContent>

            <br />
            <div style={{display:'flex',justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
              <img src={logo} width="100px" alt="" />
              <h4 style={{margin: 0}}>please login</h4>
            </div>
            <br />
            <TextField
              value={username}
              error={
                errorFor === 'username' ? true : false
              }
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              fullWidth
              color="primary"
              label="enter your email"
              type="email"
              variant="outlined"
              helperText={errorFor === 'username' ? error : null}
            />
            <br />
            <br />
            <br />
            <TextField 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              error={
                errorFor === 'password' ? true : false
              }
              color="primary"
              fullWidth
              label="enter your password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              helperText={errorFor === 'password' ? error : null}
            />
            <br />
           
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  color="primary"
                />
              }
              label="Show password"
            />
          </CardContent>
          <CardActions style={{justifyContent: 'space-between'}}>
            <Link
              onClick={() => history.push('/screen')}
              style={{cursor:'pointer',}}
            >
              Go to screen
            </Link>
            <Button
              color="primary"
              variant="contained"
              type="submit"
            >
              Log In
            </Button>
          </CardActions>
        </form>
        <br />
        <br />
        <br />
      </Card>
    </div>
  )
}

export default LogIn
