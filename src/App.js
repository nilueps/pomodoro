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
    this.playPauseReset = this.playPauseReset.bind(this)
  }
  componentDidMount() {
    this.timerID = setInterval(() => this.tic(), 1000)
    this.setState({ timer: { ...this.state.timer, timeLeft: millisecs(this.state.settings.sessionLength) } })
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }
  changeSettings = (i, e) => {
    let { settings, timer } = this.state
    switch (e.currentTarget.id) {
      case 'session':
        settings.sessionLength = i > 0 ? Math.min(60, settings.sessionLength + i) : Math.max(1, settings.sessionLength - 1)
        if (timer.status === 'session' || timer.status === 'ready' || timer.status === 'series complete') timer.timeLeft = millisecs(settings.sessionLength)
        break
      case 'break':
        settings.breakLength = i > 0 ? Math.min(60, settings.breakLength + i) : Math.max(1, settings.breakLength - 1)
        if (timer.status === 'break') timer.timeLeft = millisecs(settings.breakLength)
        break
      case 'blocks':
        if (i > 0) {
          if (settings.blocks.length < 10) settings.blocks.unshift(1)
        } else {
          if (settings.blocks.length > 1) settings.blocks.shift()
        }
        break
      default:
        break
    }
    this.setState({ settings, timer })
  }
  playPauseReset = e => {
    let { settings, timer, stats } = this.state
    
    switch (e.currentTarget.id) {
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
        this.setState({ settings, timer })
        return
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
        this.setState({ settings, timer, stats })
        return
      default:
        return
    }
  }
  
  tic() {
    if (this.state.timer.isRunning) {
      let { settings, timer, stats } = this.state
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
    this.setState({ settings, timer, stats })
    }

    
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
            callback={this.changeSettings}
          />
          <Incrementer
            key="1"
            label="break"
            value={this.state.settings.breakLength}
            callback={this.changeSettings}
          />
          <Incrementer
            key="2"
            label="blocks"
            value={this.state.settings.blocks.length}
            callback={this.changeSettings}
          />
        </div>
        <Controls isRunning={this.state.timer.isRunning} callback={this.playPauseReset} />
        <Timer {...this.state.timer} blocks={this.state.settings.blocks} />
        <Stats {...this.state} />
      </div>
    )
  }
}

export default App
