import React from 'react'
import useInterval from '../utils/useInterval'
import aa from '../images/Ornament.svg'
import {Editor, EditorState, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

// interface for mazel object
interface mazelObj {
  id?: string;
  dates?: string[];
  message?: any;
}

// props interface
interface Props {
  messages: mazelObj[]
}

const MazelCarousel:React.FC<Props> = (props) => {

  // the current index
  const [current, setCurrent] = React.useState<number>(0)

  useInterval(() => {
    if (current < props.messages.length-1) {
      setCurrent(cur => cur + 1)
    } else if (current === props.messages.length-1) {
      setCurrent(0)
    }
  }, 5000)
  
  return (
    <div className="mazel-o">
      {props.messages.length > 0 ? 
        props.messages.map((msg, index) => (
          <div className={`${index === current ? 'msg-show' : 'msg-hide'} msg-car`} key={index}>
            <div className="mazel">
              <div className="mazel-display">
                <Editor
                  editorState={
                    EditorState.createWithContent(
                      convertFromRaw(msg.message)
                  )}
                  onChange={editorState => null}
                  readOnly={true}
                  textAlignment="center"
                />
              </div>
            </div>
          </div>
        ))
        :
        <div className='msg-show msg-car'>
            <div className="mazel">
              <div className="mazel-display">
                <img src={aa} alt="" height="130px" />
              </div>
            </div>
          </div>
        }
    
    </div>
  )
}

export default MazelCarousel
