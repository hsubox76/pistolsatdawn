import React, { PropTypes } from 'react';

const DebateBox = (props) => (
  <div className="column is-half">
    <div className="card">
      <div className="card-header has-background-primary">
        <p className="card-header-title has-text-white is-size-4">
          {props.argument.title}
        </p>
      </div>
      <div className="card-content">
        <div className="content">
          <span className="tag is-info">smartness</span>
        </div>
        <div className="box">
          statement one
        </div>
        <div className="box">
          statement two
        </div>
      </div>
    </div>
  </div>
);

DebateBox.propTypes = {
  argument: PropTypes.object
};

export default DebateBox;