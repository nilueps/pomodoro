import React from 'react'
import bell from './bell.ogg'
import deepBell from './deepbell.ogg'
import './App.css'

import { millisecs } from './helpers'
import { Incrementer, Controls, Timer, Stats } from './components'

const INITIAL_STATE = {
  settings: {
    breakLength: 5,
    sessionLength: 25,
    blocks: [1, 1, 1, 1],
  },
  timer: {
    status: 'ready',
    lastStatus: '',
    timeLeft: 0,
    lastMinute: false,
    isRunning: false,
  },
  stats: {
    timeElapsed: 0,
    sessionsCompleted: 0,
  },
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount() {
    this.timerID = setInterval(() => this.tic(), 1000)
    this.setState({ timer: { ...this.state.timer, timeLeft: millisecs(this.state.settings.sessionLength) } })
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }
  handleClick = e => {
    let { settings, timer, stats } = this.state
    switch (e.currentTarget.id) {
      case 'break-increment':
        settings.breakLength = Math.min(60, settings.breakLength + 1)
        if (timer.status === 'break') {
          timer.timeLeft = millisecs(settings.breakLength)
        }
        break
      case 'break-decrement':
        settings.breakLength = Math.max(1, settings.breakLength - 1)
        if (timer.status === 'break') {
          timer.timeLeft = millisecs(settings.breakLength)
        }
        break
      case 'session-increment':
        settings.sessionLength = Math.min(60, settings.sessionLength + 1)
        if (timer.status === 'session' || timer.status === 'ready') {
          timer.timeLeft = millisecs(settings.sessionLength)
        }
        break
      case 'session-decrement':
        settings.sessionLength = Math.max(1, settings.sessionLength - 1)
        if (timer.status === 'session' || timer.status === 'ready') {
          timer.timeLeft = millisecs(settings.sessionLength)
        }
        break
      case 'blocks-increment':
        if (settings.blocks.length < 10) settings.blocks.unshift(1)
        break
      case 'blocks-decrement':
        if (settings.blocks.length > 1) settings.blocks.shift()
        break
      case 'playPause':
        timer.isRunning = !timer.isRunning
        switch (timer.status) {
          case 'ready':
          case 'series complete':
            settings.blocks = settings.blocks.map(v => 1)
            timer.status = 'session'
            timer.timeLeft = millisecs(settings.sessionLength)
            break
          case 'session':
          case 'break':
            timer.lastStatus = timer.status
            timer.status = 'paused'
            break
          case 'paused':
            timer.status = timer.lastStatus
            timer.lastStatus = 'paused'
            break
          default:
            return
        }
        break
      case 'reset':
        if (timer.status === 'ready') {
          stats.timeElapsed = 0
          stats.sessionsCompleted = 0
        } else {
          timer.status = 'ready'
        }
        settings.blocks = settings.blocks.map(v => 1)
        timer.timeLeft = millisecs(settings.sessionLength)
        timer.isRunning = false
        break
      default:
        return
    }
    this.setState({ settings, timer, stats }, () => this.computeStats())
  }
  
  tic() {
    let { settings, timer, stats } = this.state

    if (timer.isRunning) {
      if (timer.timeLeft === 0) {
        if (timer.status === 'session') {
          stats.sessionsCompleted += 1
          if (settings.blocks.reduce((a, c) => a + c) === 1) {
            settings.blocks[0] = 0
            timer.isRunning = false
            timer.status = 'series complete'
            timer.timeLeft = 0
            this.bell.currentTime = 0
            this.bell.play()
          } else {
            timer.status = 'break'
            timer.timeLeft = millisecs(settings.breakLength)
            this.beep.currentTime = 0
            this.beep.play()
          }
        } else if (timer.status === 'break') {
          if (settings.blocks[settings.blocks.length - 1]) {
            settings.blocks[settings.blocks.length - 1] = 0
          } else {
            settings.blocks[settings.blocks.indexOf(0) - 1] = 0
          }
          timer.status = 'session'
          timer.timeLeft = millisecs(settings.sessionLength)
          this.beep.currentTime = 0
          this.beep.play()
        }
      } else {
        timer.timeLeft -= 1000
        if (timer.status === 'session') stats.timeElapsed += 1000
      }
      timer.lastMinute = timer.timeLeft < 60000 ? true : false
    } else {
      timer.lastMinute = false
    }

    this.setState({ settings, timer, stats })
    
    return
  }

  render() {
    return (
      <div className="pomodoro">
        <audio
          id="beep"
          src={bell}
          type="audio/ogg"
          ref={audio => {
            this.beep = audio
          }}
        ></audio>
        <audio
          id="bell"
          src={deepBell}
          type="audio/ogg"
          ref={audio => {
            this.bell = audio
          }}
        ></audio>
        <div className="incrementers">
          <Incrementer
            key="0"
            label="session"
            value={this.state.settings.sessionLength}
            callback={this.handleClick}
          />
          <Incrementer
            key="1"
            label="break"
            value={this.state.settings.breakLength}
            callback={this.handleClick}
          />
          <Incrementer
            key="2"
            label="blocks"
            value={this.state.settings.blocks.length}
            callback={this.handleClick}
          />
        </div>
        <Controls isRunning={this.state.timer.isRunning} callback={this.handleClick} />
        <Timer {...this.state.timer} blocks={this.state.settings.blocks} />
        <Stats {...this.state} />
      </div>
    )
  }
}

export default App
