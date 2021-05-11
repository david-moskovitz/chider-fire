import React from 'react'
import {db, storage} from '../firebase'
import useGetArrayOfDates from '../utils/useGetArrayOfDates'
import useGetHebrewArrayOfDates from '../utils/useGetHebrewArrayOfDates'

import {
  ReactJewishDatePicker,
  BasicJewishDay,
} from "react-jewish-datepicker";

import { makeStyles } from '@material-ui/core/styles';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';




const useStyles = makeStyles({
  root: {
    overflow: 'visible'
  }
})

interface Props {
  open: boolean;
  setOpen: (open:boolean) => void;
}

const AddImage: React.FC<Props> = (props) => {

  const classes = useStyles();
  // show error if file is not an image
  const [isError, setIsError] = React.useState<string | null >(null);
  // show green if file is excepted
  const [highlighted, setHighlighted] = React.useState<boolean>(false);
  // file
  const [file, setFile] = React.useState<Array<File> | null>(null);
  // get temp url
  const [tempUrl, setTempUrl] = React.useState<string>('');
  // from date
  const [fromDateH, setFromDateH] = React.useState<BasicJewishDay>()
  // end date
  const [endDateH, setEndDateH] = React.useState<BasicJewishDay>()
  // is saving to storage
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  // is Yahrzeit
  const [isYahrzeit, setIsYahrzeit] = React.useState<boolean>(false)

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


  const datesArray = useGetArrayOfDates(
    fromDateH ?
        fromDateH.date.toJSON().slice(0, 10)
        : new Date().toJSON().slice(0, 10),
    endDateH ?
      endDateH.date.toJSON().slice(0, 10)
      : new Date().toJSON().slice(0, 10),
  )

  const HebrewDatesArray = useGetHebrewArrayOfDates(
    fromDateH ?
        fromDateH.date.toJSON().slice(0, 10)
        : new Date().toJSON().slice(0, 10),
    endDateH ?
      endDateH.date.toJSON().slice(0, 10)
      : new Date().toJSON().slice(0, 10),
  )
  

  // submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // make sure there is no errors and there is a file
    if (!isError && file) {
      // start loading indicator
      setIsSaving(true)
      // upload image
      storage.ref('images/' + file[0].name)
        .put(file[0])
        .then((snap) => {
          // get URL
          snap.ref.getDownloadURL().then(url => {
            // create new mazel
            const newImageMazel = {
              imageURL: url,
              ref: snap.ref.fullPath,
              dates : isYahrzeit ? HebrewDatesArray : datesArray
            }
            // post mazel
            db.collection('imageMazel').add(newImageMazel)
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
      <Card className="add-mazel-card" classes={{root: classes.root}}>
        <AppBar position="static">
          <Toolbar color="primary">
            <Typography variant="h5" color="initial" style={{flexGrow: 1}}>
              Add Image
            </Typography>
            <IconButton color="inherit" onClick={() => props.setOpen(false)}>
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
                  <img src={tempUrl}  alt=""/>
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
            <FormControlLabel
              control={
                <Switch
                  checked={isYahrzeit}
                  onChange={() => setIsYahrzeit(!isYahrzeit)}
                  color="primary"
                />
              }
              label="Set for Yahrzeit"
            />
            <div className="flex">
              <div>
                <label className='color-blue'>start date</label>
                <ReactJewishDatePicker
                  value={new Date()}
                  isHebrew
                  onClick={(day: BasicJewishDay) => {
                    setFromDateH(day);
                  }}
                />
              </div>
              <div>
                <label className='color-blue'>end date</label>
                <ReactJewishDatePicker
                  value={new Date()}
                  isHebrew
                  onClick={(day: BasicJewishDay) => {
                    setEndDateH(day);
                  }}
                />
              </div>
            </div>
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

export default AddImage
