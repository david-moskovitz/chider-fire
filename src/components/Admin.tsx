import React from 'react'
import {useHistory} from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AddMazel from './AddMazel'
import AddImage from './AddImage'
import AddMessage from './AddMessage'
import AddAds from './AddAds'
import SearchDay from './SearchDay'

import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useAuth} from '../utils/AuthContext'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'


const Admin: React.FC = (props) => {
  
  const {logout} = useAuth();
  const [openAddImage, setOpenAddImage] = React.useState<boolean>(false)
  const [openAddMazel, setOpenAddMazel] = React.useState<boolean>(false)
  const [openAddMessage, setOpenAddMessage] = React.useState<boolean>(false)
  const [openAddAds, setOpenAddAds] = React.useState<boolean>(false)

  const history = useHistory();

  return (
    <div>
      <AppBar position="static">
        <Toolbar  style={{ display: 'flex'}}>
          <Typography style={{flexGrow: 1}} variant="h6">
            luach
          </Typography>
          <div>
            <IconButton color="inherit" onClick={() => logout()}>
              <ExitToAppIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
        <div style={{display: 'flex'}}>
          <br />
          <ButtonGroup style={{margin:'40px'}} variant="outlined" color="primary"  orientation="vertical">
            <Button
              onClick={() => {
                setOpenAddImage(true)
              }}
              >
              Add Image
            </Button>
            <Button
              onClick={() => {
                setOpenAddMazel(true)
              }}
              >
              Add Mazel Tov
            </Button>
            <Button
              onClick={() => {
                setOpenAddMessage(true)
              }}
              >
              Edit Message
            </Button>
            <Button
              onClick={() => {
                setOpenAddAds(true)
              }}
              >
              Add Ad
            </Button>
            <Button
              onClick={() => {
                history.push('/import')
              }}
              >
              Import CSV
            </Button>
          </ButtonGroup>
          <div style={{ flexGrow: 1, height: '80vh'}}>
            <SearchDay />
          </div>
        </div>
        {openAddImage ?
          <div className="pop-up">
            <AddImage
              open={openAddImage}
              setOpen={setOpenAddImage}
            />
          </div>
        : null}
        {openAddMazel ? 
          <div className="pop-up">
            <AddMazel
              open={openAddMazel}
              setOpen={setOpenAddMazel}
            />
          </div>
        : null}
        {openAddMessage ? 
          <div className="pop-up">
            <AddMessage
              open={openAddMessage}
              setOpen={setOpenAddMessage}
            />
          </div>
        : null}
        {openAddAds ? 
          <div className="pop-up">
            <AddAds
              open={openAddAds}
              setOpen={setOpenAddAds}
            />
          </div>
        : null}
        
    </div>
    
  )
}

export default Admin
