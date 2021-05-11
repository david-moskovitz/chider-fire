import React from 'react'
import {Editor, EditorState, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

interface messageObj {
  message: any;
}

interface Props {
  msg: messageObj
}

const ShowMessage:React.FC<Props> = (props) => {

  return (
    <div className="message-view">
      <Editor
        editorState={
          EditorState.createWithContent(
            convertFromRaw(props.msg.message)
        )}
        onChange={editorState => null}
        readOnly={true}
        textAlignment="center"
      />
    </div>
  )
}

export default ShowMessage
