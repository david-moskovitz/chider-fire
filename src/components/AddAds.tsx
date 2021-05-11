import React from 'react'
import {db, storage} from '../firebase'

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton'


interface Props {
  open: boolean;
  setOpen: (open:boolean) => void;
}


const AddAds: React.FC<Props> = (props) => {

  // show error if file is not an image
  const [isError, setIsError] = React.useState<string | null >(null);
  // show green if file is excepted
  const [highlighted, setHighlighted] = React.useState<boolean>(false);
  // file
  const [file, setFile] = React.useState<Array<File> | null>(null);
  // get temp url
  const [tempUrl, setTempUrl] = React.useState<string>('');
  // is saving to storage
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

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
    if (newFile[0].type.includes('image')) {
      setFile(newFile);
      setTempUrl(URL.createObjectURL(newFile[0]));
      setIsError(null);
      setHighlighted(false);
    } else {
      setIsError('File must be an image')
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
    if (newFile[0] && newFile[0].type.includes('image')) {
      setFile(newFile);
      setTempUrl(URL.createObjectURL(newFile[0]));
      setIsError(null);
      setHighlighted(false);
    } else if (newFile[0] && !newFile[0].type.includes('image')) {
      setIsError('File must be an image')
    }
  }

  // submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // make sure there is no errors and there is a file
    if (!isError && file) {
      // start loading indicator
      setIsSaving(true)
      // upload image
      storage.ref('ads/' + file[0].name)
        .put(file[0])
        .then((snap) => {
          // get URL
          snap.ref.getDownloadURL().then(url => {
            // create new mazel
            const newAd = {
              imageURL: url,
              ref: snap.ref.fullPath,
            }
            // post mazel
            db.collection('ads').add(newAd)
              .catch((error) => {
                console.log(error);
              })
          })
          setIsSaving(false)
          setFile(null)
          props.setOpen(false)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  return (
    <div>
      <Card className="add-mazel-card">
        <AppBar position="static">
          <Toolbar color="primary">
            <Typography variant="h5" color="initial" style={{flexGrow:1}}>
              Add Ad
            </Typography>
            <IconButton color="inherit" onClick={()=> props.setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <input
              type="file"
              accept="image/*"
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
                  <img src={tempUrl} alt="" />
                  <div className="overlay">
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
                <h3>drag & drop image or</h3>
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
  )
}

export default AddAds
