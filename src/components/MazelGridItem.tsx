import React from 'react'
import {HDate} from '@hebcal/core';
import IconButton from '@material-ui/core/IconButton'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import EventIcon from '@material-ui/icons/Event';
import Chip from '@material-ui/core/Chip';
import {db} from '../firebase'
import {Editor, EditorState, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

import Button from '@material-ui/core/Button'


import {
  ReactJewishDatePicker,
  BasicJewishDay
} from "react-jewish-datepicker";



interface Props {
  messages: any;
  msg: any;
}


const MazelGridItem:React.FC<Props> = (props) => {


  const [openEditDates, setOpenEditDates] = React.useState<boolean>(false)
  const [newDatesArray, setNawDatesArray] = React.useState<string[]>([])
  
  React.useEffect(() => {
    setNawDatesArray(newDatesArray.length >= 1 ?
      newDatesArray
      : props.msg.dates)
  }, [])
  
  const deleteImage = (id:string | undefined) => {
    db.doc(`mazelTov/${id}`).delete()
  }

  const handleDelete = (date:string) => {
    const array = newDatesArray.length >= 1 ?
      newDatesArray
      : props.msg.dates

    setNawDatesArray(array.filter((d:any) => d !== date))
  }
  const editDates = () => {
    db.doc(`mazelTov/${props.msg.id}`).update({
      dates: newDatesArray
    }).then(()=> {
      setOpenEditDates(false)
    })
  }


  return (
    <div className="mazel-border">
      <Editor
        editorState={
          EditorState.createWithContent(
            convertFromRaw(props.msg.message)
        )}
        onChange={editorState => null}
        readOnly={true}
        textAlignment="center"
      />
      <div className="msg-overlay">
        <IconButton
          color='inherit'
          onClick={() => {
            setOpenEditDates(true)
          }}
        >
          <EditIcon />
        </IconButton>
        <div style={{flexGrow: 1}}>{props.msg.dates ?
          props.msg.dates[0].match(/^\d{4}-\d{2}-\d{2}$/) ? 
            new HDate(new Date(props.msg.dates[0]))
              .renderGematriya()
              .replace(/[\u0591-\u05C7]/g, '')
            : props.msg.dates[0]
        : null}</div>
        <IconButton
          color='inherit'
          onClick={() => deleteImage(props.msg.id)}
        >
          <DeleteForeverIcon />
        </IconButton>
      </div>
      <Dialog
            open={openEditDates}
            onClose={() => setOpenEditDates(false)}
          >
            <DialogTitle>
              Edit Dates
            </DialogTitle>
            <DialogContent>
              <div style={{border: '2px solid gray', borderRadius:'10px'}}>{newDatesArray ? newDatesArray.map((date:any) => (
                <Chip
                  style={{margin: '5px'}}
                  key={date}
                  icon={<EventIcon />}
                  label={new HDate(new Date(date))
                    .renderGematriya()
                    .replace(/[\u0591-\u05C7]/g, '')}
                  onDelete={newDatesArray.length > 1 ? () => handleDelete(date) : undefined}
                />
              ))
            : null}</div>
            <br />
            <label>
              Add Date
              <ReactJewishDatePicker
                value={new Date()}
                isHebrew
                onClick={(day: BasicJewishDay) => {
                  setNawDatesArray(prev => [...prev, day.date.toJSON().slice(0, 10)])
                }}
              />
            </label>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={editDates}>
                save
              </Button>
            </DialogActions>
          </Dialog>
    </div>
  )
}

export default MazelGridItem
