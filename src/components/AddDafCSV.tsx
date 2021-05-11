import React from 'react'
import {useHistory} from 'react-router-dom'
import a2 from '../images/a2.jpg'
import b2 from '../images/b2.jpg'
import c1 from '../images/c1.jpg'
import d1 from '../images/d1.jpg'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { parse } from "papaparse";
import {useAuth} from '../utils/AuthContext'
import Button from '@material-ui/core/Button'
import { db } from '../firebase'

const AddDafCSV = () => {

  // show error if file is not an image
  const [isError, setIsError] = React.useState<string | null >(null);
  // show green if file is excepted
  const [highlighted, setHighlighted] = React.useState<boolean>(false);
  // file
  const [file, setFile] = React.useState<Array<File> | null>(null);
  // is saving to storage
  const [isSaving, setIsSaving] = React.useState<boolean>(false);


  const {logout} = useAuth();
  const history = useHistory();

  // create ref for hidden file dialog
  const hiddenInput = React.useRef<HTMLInputElement>(null)
  // handle drag enter 
  const handleDragEnter = () => {
    setIsError(null)
    setHighlighted(true)
  }

  // handle file once dropped
  const handleFileDrop = (event: any) => {
    event.preventDefault();
    setFile(null);
    const newFile: any = Array.from(event.dataTransfer.files);
    
    
    if (newFile[0].type === 'text/csv' || 'application/vnd.ms-excel') {
      setFile(newFile);
      setIsError(null);
      setHighlighted(false);
    } else {
      setIsError('File must be a csv')
    }
  }

  // artificial click on input
  const handleChooseFileClick = () => {
    if (hiddenInput && hiddenInput.current) {
      hiddenInput.current.click()
    }
  }

  const handleFileChoose = (event: any) => {
    setFile(null);
    const newFile: any = Array.from(event.target.files);
    if (newFile[0] && (newFile[0].type === 'text/csv' || 'application/vnd.ms-excel')) {
      setFile(newFile);
      setIsError(null);
      setHighlighted(false);
    } else if (newFile[0] && !newFile[0].type.includes('image')) {
      setIsError('File must be an image')
    }
  }


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isError && file) {
      // start loading indicator
      setIsSaving(true)
      file[0].text()
        .then((text) => {
          const result = parse(text, { header: true });
          db.doc('daf/daf').set({
            body: result.data,
            createdAt: new Date()
          })
          setIsSaving(false)
        })
    }
  }

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
      <Button
        style={{margin:'40px'}}
        variant="outlined"
        color="primary"
        onClick={() => history.push('/admin')}
        startIcon={<ArrowBackIosIcon />}
      >
        back to admin
      </Button>
      <div style={{display: 'flex', justifyContent: 'space-around',}}>
        <div style={{ width:'700px', border:'3px solid lightGray', paddingLeft:'20px', marginLeft: '150px'}}>
          <h1 style={{textAlign:'center'}}>Before you start</h1>
          <div className="instructions" style={{overflowY:'scroll', maxHeight:'70vh',}}>
            <p>make sure the CSV file if formatted correctly...
              <br />
              start by opening an google sheet
            </p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/spreadsheets/u/0/"
              className="btn-google-sheet">
              open google sheets <OpenInNewIcon />
            </a>
            <p>
              Now add the heading on the first row like this
              <br />
              column 1 {'>'} <b>date</b>
              <br />
              column 2 {'>'} <b>ahavathTorah</b>
              <br />
              column 3 {'>'} <b>halachaYomis</b>
              <br />
              like this
            </p>
            <img src={a2} alt="" />
            <p>
              now highlight the date column and select
              <br />
              <b>Format {'>'} Number {'>'} More Formats {'>'} More date and time formats</b>
            </p>
            <img src={b2} width="500px" alt="" />
            <p>
              A popup will show up like this
            </p>
            <img src={c1} width="300px" alt="" />
            <p>
              select format YYYY-MM-DD and click apply
              <br />
              now fill in the information for <span style={{color: 'red', fontWeight: 900}}>max of 300 days</span>
            </p>
            <h2 style={{textAlign:'center'}}>saving to CSV file</h2>
            <p>
              select <b>File {'>'} download {'>'} Comma-separated values (.csv, current sheet)</b>
            </p>
            <img src={d1} width="300px" alt="" />
          </div>
        </div>
          <br />
        <div style={{display:'flex', justifyContent:'center',alignItems:'center', flexGrow:1}}>
          <Card className="add-mazel-card-a">
            <AppBar position="static">
              <Toolbar color="primary">
                <Typography variant="h5" color="initial" style={{flexGrow: 1}}>
                  Add CSV
                </Typography>
              </Toolbar>
            </AppBar>
            <form 
              onSubmit={handleSubmit}
            >
              <CardContent>
                <input
                  type="file"
                  accept=".csv"
                  ref={hiddenInput}
                  hidden
                  onChange={handleFileChoose}
                />
                <div
                  className={`drag-out
                    ${isError ? 'border-red'
                    : highlighted ? 'border-green' 
                    : 'border-blue'}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={() => {
                    setHighlighted(false)
                    setIsError(null)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={handleFileDrop}
                >
                  {file ? 
                    <div className="file">
                      
                      <div className="overlay-a">
                        <div className="file-del" onClick={() => {
                          setFile(null)
                        }}>
                          <CloseIcon fontSize="small" />
                        </div>
                        {file[0].name}
                      </div>
                    </div>
                  : 
                  <div
                    className="dnd-btn"
                    onClick={handleChooseFileClick}
                  >
                    <h3>drag & drop CSV or</h3>
                    <span>browse</span>
                  </div>}
                </div>
                {isError ? 
                    <span className="color-red">{isError}</span>
                    : null
                  }
                <br />
              </CardContent>
              <CardActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={file ? false : true}
                  startIcon={isSaving ? <CircularProgress size={20} color="inherit"/> : null}
                >
                  save
                </Button>
              </CardActions>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddDafCSV
