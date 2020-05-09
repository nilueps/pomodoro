import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faUndoAlt, faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons'
import { millisecs, getHumanTime } from './helpers'

export class Incrementer extends React.PureComponent {
  render() {
    const idLabel = this.props.label + '-label'
    const idValue = this.props.label + '-value'
    const labelText =
      this.props.label[0].toUpperCase() +
      this.props.label.slice(1) +
      (this.props.label !== 'blocks' ? ' Length' : '')
    return (
      <div className="incrementer">
        <div className="label" id={idLabel}>
          {labelText}
        </div>
        <div className="updown">
          <div className="btn up" id={this.props.label} onClick={e => this.props.callback(1, e)}>
            +
          </div>
          <div className="btn down" id={this.props.label} onClick={e => this.props.callback(-1, e)}>
            &ndash;
          </div>
        </div>
        <div className="number" id={idValue}>
          {this.props.value}
        </div>
      </div>
    )
  }
}

/* export function Incrementer(props) {
  console.log('Incrementer rendered')
  // props include value to display, as well as a callback function
  // to change that value stored in parent state
  const idLabel = props.label + '-label'
  const idValue = props.label + '-value'
  const labelText =
    props.label[0].toUpperCase() + props.label.slice(1) + (props.label !== 'blocks' ? ' Length' : '')
  return (
    <div className="incrementer">
      <div className="label" id={idLabel}>
        {labelText}
      </div>
      <div className="updown">
        <div className="btn up" id={props.label} onClick={e => props.callback(1, e)}>
          +
        </div>
        <div className="btn down" id={props.label} onClick={e => props.callback(-1, e)}>
          &ndash;
        </div>
      </div>
      <div className="number" id={idValue}>
        {props.value}
      </div>
    </div>
  )
} */

export class Controls extends PureComponent {
  render() {
    console.log('Controls rendered')
    return (
      <div className="controls">
        <div className="btn" id="playPause" onClick={this.props.callback}>
          <FontAwesomeIcon icon={this.props.isRunning ? faPause : faPlay} />
        </div>
        <div className="btn" id="reset" onClick={this.props.callback}>
          <FontAwesomeIcon icon={faUndoAlt} />
        </div>
      </div>
    )
  }
}

/* export function Controls(props) {
  console.log('Controls rendered')
  return (
    <div className="controls">
      <div className="btn" id="playPause" onClick={props.callback}>
        <FontAwesomeIcon icon={props.isRunning ? faPause : faPlay} />
      </div>
      <div className="btn" id="reset" onClick={props.callback}>
        <FontAwesomeIcon icon={faUndoAlt} />
      </div>
    </div>
  )
}
 */

export class Timer extends PureComponent {
  render() {
    console.log('Timer rendered')
    const lastMinute = this.props.timer.isRunning && this.props.timer.timeLeft < 60000 ? true : false
    let label = this.props.timer.status[0].toUpperCase() + this.props.timer.status.slice(1)
    if (
      !this.props.timer.isRunning &&
      (this.props.timer.status === 'session' || this.props.timer.status === 'break')
    ) {
      label = 'Paused'
    }
    const blockDots = this.props.blocks.map((v, i) => {
      return v ? (
        <FontAwesomeIcon key={i} icon={fasCircle} />
      ) : (
        <FontAwesomeIcon key={i} icon={farCircle} />
      )
    })
    return (
      <div className={'timer' + (lastMinute ? ' red-alert' : '')}>
        <div className="timer-label" id="timer-label">
          {label}
        </div>
        <div className="time-left" id="time-left">
          {getHumanTime(this.props.timer.timeLeft, 'ms:')}
        </div>
        <div className="blocks-display">{blockDots}</div>
      </div>
    )
  }
}
/*  export function Timer(props) {
  console.log('Timer rendered')
  const lastMinute = props.timer.isRunning && props.timer.timeLeft < 60000 ? true : false
  let label = props.timer.status[0].toUpperCase() + props.timer.status.slice(1)
  if (!props.timer.isRunning && (props.timer.status === 'session' || props.timer.status === 'break')) {
    label ='Paused'
  }
  const blockDots = props.blocks.map((v, i) => {
    return v ? (
      <FontAwesomeIcon key={i} icon={fasCircle} />
    ) : (
      <FontAwesomeIcon key={i} icon={farCircle} />
    )
  })
  return (
    <div className={'timer' + (lastMinute ? ' red-alert' : '')}>
      <div className="timer-label" id="timer-label">
        {label}
      </div>
      <div className="time-left" id="time-left">
        {getHumanTime(props.timer.timeLeft, 'ms:')}
      </div>
      <div className="blocks-display">{blockDots}</div>
    </div>
  )
}
 */
export class Stats extends PureComponent {
  render() {
    console.log('Stats rendered')
    let { settings, timer, stats } = this.props
    const timeBlock = millisecs(settings.sessionLength + settings.breakLength)
    const fullBlocksLeft = Math.max(0, settings.blocks.reduce((a, c) => a + c) - 1)
    let totalTimeLeft = timer.timeLeft + fullBlocksLeft * timeBlock
    if (timer.status === 'break') totalTimeLeft -= millisecs(settings.breakLength)
    return (
      <div className="stats">
        <div>Total time remaining: {getHumanTime(totalTimeLeft, 'hm')}</div>
        <div>Series ends at {getHumanTime(new Date(Date.now() + totalTimeLeft), 'hm:a')}</div>
        <hr />
        <div>Sessions completed: {stats.sessionsCompleted}</div>
        <div>Total session time: {getHumanTime(stats.timeElapsed, 'hm')}</div>
      </div>
    )
  }
}
/* export function Stats(props) {
  console.log('Stats rendered')
  let { settings, timer, stats } = props
  const timeBlock = millisecs(settings.sessionLength + settings.breakLength)
  const fullBlocksLeft = Math.max(0, settings.blocks.reduce((a, c) => a + c) - 1)
  let totalTimeLeft = timer.timeLeft + fullBlocksLeft * timeBlock
  if (timer.status === 'break') totalTimeLeft -= millisecs(settings.breakLength)
  return (
    <div className="stats">
      <div>Total time remaining: {getHumanTime(totalTimeLeft, 'hm')}</div>
      <div>Series ends at {getHumanTime(new Date(Date.now() + totalTimeLeft), 'hm:a')}</div>
      <hr />
      <div>Sessions completed: {stats.sessionsCompleted}</div>
      <div>Total session time: {getHumanTime(stats.timeElapsed, 'hm')}</div>
    </div>
  )
} */
