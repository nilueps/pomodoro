import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { getHumanTime } from '../helpers';

export default class Timer extends PureComponent {
  render() {
    // console.log(Object.getPrototypeOf(this).constructor.name, 'rendered');
    const lastMinute = this.props.isRunning && this.props.timeLeft < 60000 ? true : false;
    let label = this.props.status[0].toUpperCase() + this.props.status.slice(1);
    if (!this.props.isRunning &&
      (this.props.status === 'session' || this.props.status === 'break')) {
      label = label + ' paused';
    }
    const blockDots = this.props.blocks.map((v, i) => {
      return v ? (<FontAwesomeIcon key={i} icon={fasCircle} />) : (<FontAwesomeIcon key={i} icon={farCircle} />);
    });
    return (<div className={'timer' + (lastMinute ? ' red-alert' : '')}>
      <div className="timer-label" id="timer-label">
        {label}
      </div>
      <div className="time-left" id="time-left">
        {getHumanTime(this.props.timeLeft, 'ms:')}
      </div>
      <div className="blocks-display">{blockDots}</div>
    </div>);
  }
}
