import React, { PropTypes } from 'react';

const DebateBox = (props) => (
  <div className='debate-box'>
    Argument: {props.argument.title}
  </div>
);

DebateBox.propTypes = {
  argument: PropTypes.object
};

export default DebateBox;