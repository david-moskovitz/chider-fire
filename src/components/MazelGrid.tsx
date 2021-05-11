import React from 'react'
import MazelGridItem from './MazelGridItem'

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


const MazelGrid:React.FC<Props> = (props) => {

  return (
    <div className="column-mazel">
      {props.messages.length > 0 ?
        props.messages.map(msg => (
          <MazelGridItem
            messages={props.messages}
            msg={msg}
            key={msg.id}
          />
        ))
        : <h3>no mazel tov for today</h3>}
    </div>
  )
}

export default MazelGrid
