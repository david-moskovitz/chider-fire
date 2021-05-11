import React from 'react'
import {db} from '../firebase'

import {Editor, EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';



import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';



interface Props {
  open: boolean;
  setOpen: (open:boolean) => void;
}


const AddMessage: React.FC<Props> = (props) => {

  // editor state
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );
  // show error if text is more than 3 lines long
  const [isError, setIsError] = React.useState<string | null >(null);

  // get line amount
  const size = editorState.getCurrentContent().getBlockMap().size;
  // set error
  React.useEffect(() => {
    if (size > 4) {
      setIsError("Message can't be longer than 4 lines")
    } else {
      setIsError(null)
    }
  }, [editorState])

  React.useEffect(() => {
    db.doc('message/message').onSnapshot((snap) => {
      const data = snap.data()! // makes sure its not undefined
      const msg = {
        message: data.message
      }
      setEditorState(EditorState.createWithContent(
        convertFromRaw(msg.message)))
    })
  }, [])


  // submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isError) {
      // convertToRaw is to convert the data to raw js
      const newMazel = {
        message : convertToRaw(editorState.getCurrentContent()),
      }
      db.doc('message/message').set(newMazel)
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
      <Card className="add-mazel-card">
        <AppBar position="static">
          <Toolbar color="primary">
            <Typography variant="h5" color="initial" style={{flexGrow: 1}}>
              Edit Message
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

export default AddMessage
