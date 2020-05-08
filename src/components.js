import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faUndoAlt, faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons'
import { millisecs, getHumanTime } from './helpers'

export function Incrementer(props) {
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
}
export function Controls(props) {
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
export function Timer(props) {
  // props include time left and current status (break or session)
  const lastMinute = props.isRunning && props.timeLeft < 60000 ? true : false
  const redAlert = lastMinute ? ' red-alert' : ''
  const blockDots = props.blocks.map((v, i) => {
    return v ? (
      <FontAwesomeIcon key={i} icon={fasCircle} />
    ) : (
      <FontAwesomeIcon key={i} icon={farCircle} />
    )
  })
  return (
    <div className={'timer' + redAlert}>
      <div className="timer-label" id="timer-label">
        {props.status[0].toUpperCase() + props.status.slice(1)}
      </div>
      <div className="time-left" id="time-left">
        {getHumanTime(props.timeLeft, 'ms:')}
      </div>
      <div className="blocks-display">{blockDots}</div>
    </div>
  )
}
export function Stats(props) {
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
}
