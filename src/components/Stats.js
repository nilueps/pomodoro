import React, { PureComponent } from 'react';
import { millisecs, getHumanTime } from '../helpers';

export default class Stats extends PureComponent {
  render() {
    // console.log(Object.getPrototypeOf(this).constructor.name, 'rendered')
    const timeBlock = millisecs(this.props.sessionLength + this.props.breakLength);
    const fullBlocksLeft = Math.max(0, this.props.blocks.reduce((a, c) => a + c) - 1);
    let totalTimeLeft = this.props.timeLeft + fullBlocksLeft * timeBlock;
    if (this.props.status === 'break')
      totalTimeLeft -= millisecs(this.props.breakLength);
    return (<div className="stats">
      <div>{getHumanTime(totalTimeLeft, 'hm')} until complete</div>
      <div>Finish at {getHumanTime(new Date(this.props.now + totalTimeLeft), 'hm:a')}</div>
      <hr />
      <div>{this.props.sessionsCompleted} sessions completed </div>
      <div>{getHumanTime(this.props.timeElapsed, 'hm')} in total</div>
    </div>);
  }
}
