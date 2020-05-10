import React from 'react';

export default class Incrementer extends React.PureComponent {
  render() {
    // console.log(Object.getPrototypeOf(this).constructor.name, 'rendered');
    const idLabel = this.props.label + '-label';
    const idValue = this.props.label + '-value';
    const labelText = this.props.label[0].toUpperCase() +
      this.props.label.slice(1) +
      (this.props.label !== 'blocks' ? ' Length' : '');
    return (<div className="incrementer">
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
    </div>);
  }
}
