import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faUndoAlt } from '@fortawesome/free-solid-svg-icons';

export default class Settings extends PureComponent {
  render() {
    // console.log(Object.getPrototypeOf(this).constructor.name, 'rendered');
    return (<div className="controls">
      <div className="btn" id="playPause" onClick={this.props.callback}>
        <FontAwesomeIcon icon={this.props.isRunning ? faPause : faPlay} />
      </div>
      <div className="btn" id="reset" onClick={this.props.callback}>
        <FontAwesomeIcon icon={faUndoAlt} />
      </div>
    </div>);
  }
}
