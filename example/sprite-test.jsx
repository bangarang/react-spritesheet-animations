var React = require('react');
var Sprite = require('../components/sprite.jsx');

var util = require('util');

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};


module.exports = React.createClass({
  mixins: [ SetIntervalMixin ],
  getInitialState: function(){
    return {
      image: "/icons/blk-2.svg",
      columns: 11,
      frames: 22,
      duration: .5,
      frameW: 250,
      frameH: 200,
      hover: false,
      loop: true
    };
  },

  handleColumns: function(event) {
    this.setState({columns: event.target.value});
  },

  handleFrames: function(event) {
    this.setState({frames: event.target.value});
  },

  handleDuration: function(event) {
    var value = parseInt(event.target.value)
    var seconds = value / 1000;
    this.setState({duration: seconds});

  },

  handleFrameW: function(event) {
    this.setState({frameW: event.target.value});
  },

  handleFrameH: function(event) {
    this.setState({frameH: event.target.value});
  },

  handleHover: function() {
    this.setState({hover: !this.state.hover, loop: !this.state.loop});
  },

  render: function render() {
    var self = this;

    var image = self.state.image,
        columns = self.state.columns,
        frames = self.state.frames,
        duration = self.state.duration,
        duration_control = self.state.duration * 1000,
        frameW = self.state.frameW,
        frameH = self.state.frameH,
        hover = self.state.hover,
        loop = self.state.loop;

    return (
      <div>
        <h3 className="centered">Go ahead and play with some Spritesheet animations: </h3>

        <div className="home_sprite">
          <Sprite
            image={image}
            columns={columns}
            frames={frames}
            speed={(duration* 1000)/ frames}
            duration={duration}
            frameW={frameW}
            frameH={frameH}
            hover={hover}
            loop={loop} />
        </div>
        <div className="controls">

          <div className="control">
            <p><input className="simple_input" type="number" name="columns" value={columns} onChange={this.handleColumns} /> Columns:</p>
            <input type="range" name="columns" min="0" max="100" value={columns} onChange={this.handleColumns} />
          </div>

          <div className="control">
            <p><input className="simple_input" type="number" name="frames" value={frames} onChange={this.handleFrames} /> Frames:</p>
            <input type="range" name="frames" min="0" max="100" value={frames} onChange={this.handleFrames} />
          </div>

          <div className="control">
            <p><input className="simple_input" type="number" name="duration" value={duration_control} onChange={this.handleDuration} /> Duration (in milliseconds):</p>
            <input type="range" name="duration" min="0" max="10000" value={duration_control} onChange={this.handleDuration} />
          </div>

          <div className="control">
            <p><input className="simple_input" type="number" name="frameW" value={frameW} onChange={this.handleFrameW} /> Frame Width (in pixels):</p>
            <input type="range" name="frameW" min="0" max="100" value={frameW} onChange={this.handleFrameW} />
          </div>

          <div className="control">
            <p><input className="simple_input" type="number" name="frameH" value={frameH} onChange={this.handleFrameH} /> Frame Height (in pixels):</p>
            <input type="range" name="frameH" min="0" max="100" value={frameH} onChange={this.handleFrameH} />
          </div>

          <div className="control">
            <p>
              { hover ?  <button onClick={this.handleHover} className="hover hoverloop_button">Hover</button> : null }
              { loop ? <button onClick={this.handleHover} className="loop hoverloop_button">Loop</button> : null }
            </p>
          </div>
        </div>

        <Loader />

      </div>
    );
  }
});
