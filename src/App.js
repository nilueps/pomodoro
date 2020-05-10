import React from 'react'
import bell from './bell.ogg'
import deepBell from './deepbell.ogg'
import './App.css'

import { millisecs } from './helpers'
import Stats from "./components/Stats"
import Timer from "./components/Timer"
import Settings from "./components/Settings"
import Incrementer from "./components/Incrementer"

const INITIAL_STATE = {
  sessionLength: 25,
  breakLength: 5,
  blocks: [1, 1, 1, 1],
  status: 'ready',
  timeLeft: 0,
  isRunning: false,
  timeElapsed: 0,
  sessionsCompleted: 0,
  now: Date.now(),
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
    this.playPauseReset = this.playPauseReset.bind(this)
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tic(), 1000)
    this.setState({ timeLeft: millisecs(this.state.sessionLength) })
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  changeSettings = (i, e) => {
    let { sessionLength, breakLength, timeLeft } = this.state
    let blocks = [...this.state.blocks]
    switch (e.currentTarget.id) {
      case 'session':
        sessionLength =
          i > 0 ? Math.min(60, sessionLength + i) : Math.max(1, sessionLength - 1)
        if (this.state.status !== 'break') timeLeft = millisecs(sessionLength)
        break
      case 'break':
        breakLength =
          i > 0 ? Math.min(60, breakLength + i) : Math.max(1, breakLength - 1)
        if (this.state.status === 'break') timeLeft = millisecs(breakLength)
        break
      case 'blocks':
        if (i > 0) {
          if (blocks.length < 10) blocks.unshift(1)
        } else {
          if (blocks.length > 1) blocks.shift()
        }
        break
      default:
        break
    }
    this.setState({ sessionLength, breakLength, blocks, timeLeft })
  }

  playPauseReset = e => {
    let { sessionLength, timeLeft, status, isRunning, timeElapsed, sessionsCompleted } = this.state
    let blocks = [...this.state.blocks]
    switch (e.currentTarget.id) {
      case 'playPause':
        isRunning = !isRunning
        this.setState({ isRunning })
        if (status === 'ready' || status === 'series completed') {
          blocks = blocks.map(v => 1)
          status = 'session'
          timeLeft = millisecs(sessionLength)
          this.setState({ blocks, status, timeLeft })
        }
        return
      case 'reset':
        if (status === 'ready') {
          timeElapsed = 0
          sessionsCompleted = 0
          this.setState({ timeElapsed, sessionsCompleted })
        } else {
          status = 'ready'
        }
        blocks = blocks.map(v => 1)
        timeLeft = millisecs(sessionLength)
        isRunning = false
        this.setState({ blocks, status, timeLeft, isRunning })
        return
      default:
        break
    }
  }
  
  tic() {
    // console.count('Tic')
    let {
      sessionLength,
      breakLength,
      blocks,
      status,
      timeLeft,
      isRunning,
      timeElapsed,
      sessionsCompleted,
    } = this.state
    if (isRunning) {
      if (timeLeft === 0) {
        if (status === 'session') {
          sessionsCompleted += 1
          if (blocks.reduce((a, c) => a + c) === 1) {
            blocks[0] = 0
            isRunning = false
            status = 'series complete'
            timeLeft = 0
            this.bell.currentTime = 0
            this.bell.play()
          } else {
            status = 'break'
            timeLeft = millisecs(breakLength)
            this.beep.currentTime = 0
            this.beep.play()
          }
        } else if (status === 'break') {
          if (blocks[blocks.length - 1]) {
            blocks[blocks.length - 1] = 0
          } else {
            blocks[blocks.indexOf(0) - 1] = 0
          }
          status = 'session'
          timeLeft = millisecs(sessionLength)
          this.beep.currentTime = 0
          this.beep.play()
        }
      } else {
        timeLeft -= 1000
        if (status === 'session') timeElapsed += 1000
      }
      this.setState({
        sessionLength,
        breakLength,
        blocks,
        status,
        timeLeft,
        isRunning,
        timeElapsed,
        sessionsCompleted,
        now: Date.now(),
      })
      return
    } else {
      // keep completion time updated if paused
      this.setState({ now: Date.now() })
    }
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
            value={this.state.sessionLength}
            callback={this.changeSettings}
          />
          <Incrementer
            key="1"
            label="break"
            value={this.state.breakLength}
            callback={this.changeSettings}
          />
          <Incrementer
            key="2"
            label="blocks"
            value={this.state.blocks.length}
            callback={this.changeSettings}
          />
        </div>
        <Settings isRunning={this.state.isRunning} callback={this.playPauseReset} />
        <Timer
          isRunning={this.state.isRunning}
          status={this.state.status}
          timeLeft={this.state.timeLeft}
          blocks={this.state.blocks}
        />
        <Stats {...this.state} />
      </div>
    )
  }
}

export default App
