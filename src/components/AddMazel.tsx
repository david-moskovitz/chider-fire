import React from 'react'
import {db} from '../firebase'
import useGetArrayOfDates from '../utils/useGetArrayOfDates'

import {Editor, EditorState, convertToRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

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
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';



const useStyles = makeStyles({
  root: {
    overflow: 'visible'
  }
})


interface Props {
  open: boolean;
  setOpen: (open:boolean) => void;
}


const AddMazel: React.FC<Props> = (props) => {

  const classes = useStyles();
  // editor state
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );
  // show error if text is more than 3 lines long
  const [isError, setIsError] = React.useState<string | null >(null);
  // from date
  const [fromDateH, setFromDateH] = React.useState<BasicJewishDay>()
  // end date
  const [endDateH, setEndDateH] = React.useState<BasicJewishDay>()
  // get line amount
  const size = editorState.getCurrentContent().getBlockMap().size;
  // set error
  React.useEffect(() => {
    if (size > 3) {
      setIsError("Mazel-tov can't be longer than 3 lines")
    } else {
      setIsError(null)
    }
  }, [editorState])

  const datesArray = useGetArrayOfDates(
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
    if (!isError) {
      // convertToRaw is to convert the data to raw js
      const newMazel = {
        message : convertToRaw(editorState.getCurrentContent()),
        dates : datesArray
      }
      db.collection('mazelTov').add(newMazel)
        .then(() => {
          props.setOpen(false)
        }).catch((error) => {
          console.error(error)
        })
        setEditorState(EditorState.createEmpty())
    } else {
      console.error(isError)
    }
  }

  return (
    <div>
      <Card className="add-mazel-card" classes={{root: classes.root}}>
        <AppBar position="static">
          <Toolbar color="primary">
            <Typography variant="h5" color="initial" style={{flexGrow: 1}}>
              Add Mazel Tov
            </Typography>
            <IconButton color="inherit" onClick={() => props.setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div
              className={`editor-out ${isError?'border-red': 'border-blue'}`}
              >
              <Editor
                textAlignment="center"
                editorState={editorState}
                onChange={setEditorState}
              />
              {isError ? 
                <span className="color-red">{isError}</span>
                : null
              }
            </div>
            <br />
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
              disabled={editorState.getCurrentContent().hasText() ? false : true}
            >
              save
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  )
}

export default AddMazel
