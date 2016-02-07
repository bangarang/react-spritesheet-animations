'use strict';

var React = require('react');
var util = require('util');
var Isvg = require('react-inlinesvg');
var VisibilitySensor = require('react-visibility-sensor');
var TimerMixin = require('react-timer-mixin');

function getFilePathExtension(path) {
	var filename = path.split('\\').pop().split('/').pop();
	return filename.substr((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
}

module.exports = React.createClass({
	displayName: 'exports',

	mixins: [TimerMixin],
	getInitialState: function getInitialState() {
		return { animation: "start", current_frame: 0, x: 0, y: 0, interval: {}, timer: {} };
	},

	getDefaultProps: function getDefaultProps() {
		return { hover: true, loop: false, play: false };
	},

	componentWillMount: function componentWillMount() {},

	componentDidMount: function componentDidMount() {
		var self = this;
		self.animate();
	},

	componentWillUnmount: function componentWillUnmount() {
		this.setState({ animation: "stop" });
		this.cancelAnimationFrame();
	},

	enter: function enter() {
		var self = this;
		self.setState({ animation: "forward" });
	},

	out: function out() {
		var self = this;
		self.setState({ animation: "reverse" });
	},

	enterLoop: function enterLoop() {
		this.setState({ animation: "startloop" });
	},

	outLoop: function outLoop() {
		this.setState({ animation: "stoploop" });
	},

	play: function play() {
		this.setState({ animation: "play" });
	},

	reset: function reset() {
		this.setState({ animation: "stoploop" });
	},

	onVisible: function onVisible(isVisible) {
		var self = this;
		if (isVisible) {
			self.play();
		} else {
			self.reset();
		};
	},

	animation: function animation() {
		var self = this;

		self.requestAnimationFrame(self.animate);

		if (self.state.animation == "start") {}

		if (self.state.animation == "forward" && self.state.current_frame != self.props.frames - 1) {
			var new_frame = self.state.current_frame + 1;
			var col = new_frame % self.props.columns + 1;
			var row = Math.floor(new_frame / self.props.columns) + 1;

			var x = (col - 1) * self.props.frameW * -1;
			var y = (row - 1) * self.props.frameH * -1;
			self.setState({ current_frame: new_frame, x: x, y: y });
		}

		if (self.state.animation == "reverse" && self.state.current_frame != 0) {
			var new_frame = self.state.current_frame - 1;
			var col = new_frame % self.props.columns + 1;
			var row = Math.floor(new_frame / self.props.columns) + 1;

			var x = (col - 1) * self.props.frameW * -1;
			var y = (row - 1) * self.props.frameH * -1;
			self.setState({ current_frame: new_frame, x: x, y: y });
		}

		if (self.state.animation == "startloop") {
			if (self.state.current_frame == self.props.frames - 1) {
				self.setState({ current_frame: 0, x: 0, y: 0 });
			} else {
				var new_frame = self.state.current_frame + 1;
				var col = new_frame % self.props.columns + 1;
				var row = Math.floor(new_frame / self.props.columns) + 1;

				var x = (col - 1) * self.props.frameW * -1;
				var y = (row - 1) * self.props.frameH * -1;
				self.setState({ current_frame: new_frame, x: x, y: y });
			}
		}

		if (self.state.animation == "play") {
			if (self.state.current_frame == self.props.frames - 1) {
				self.setState({ animation: "start" });
			} else {
				var new_frame = self.state.current_frame + 1;
				var col = new_frame % self.props.columns + 1;
				var row = Math.floor(new_frame / self.props.columns) + 1;

				var x = (col - 1) * self.props.frameW * -1;
				var y = (row - 1) * self.props.frameH * -1;
				self.setState({ current_frame: new_frame, x: x, y: y });
			}
		}

		if (self.state.animation == "stoploop") {
			self.setState({ current_frame: 0, x: 0, y: 0 });
		}
	},

	animate: function animate() {
		var self = this;
		var speed = Math.floor(1000 * self.props.duration / self.props.frames);

		self.setTimeout(self.animation, speed);
	},

	render: function render() {
		var self = this;

		var image = self.props.image,
		    width = self.props.frameW * self.props.columns,
		    hover = self.props.hover,
		    loop = self.props.loop,
		    play = self.props.play,
		    height = self.props.frameH * Math.ceil(self.props.frames / self.props.columns);

		if (self.props.className) {
			var className = self.props.className + " icon sprite_container";
		} else {
			var className = "icon sprite_container";
		}

		var style = {
			transform: "translateX(" + self.state.x + "px) translateY(" + self.state.y + "px)",
			WebkitTransform: "translateX(" + self.state.x + "px) translateY(" + self.state.y + "px)",
			width: width,
			height: height,
			position: "absolute"
		};

		var size = {
			height: self.props.frameH + "px",
			width: self.props.frameW + "px"
		};

		if (image) {
			if (hover) {
				if (getFilePathExtension(image) === "svg") {
					return React.createElement(
						'span',
						{ onMouseEnter: self.enter, onMouseLeave: self.out, className: className, style: size, key: image },
						React.createElement(
							'span',
							{ className: 'svg_icon_wrapper', style: style, key: image },
							React.createElement(Isvg, { src: image, className: 'isvg', key: image })
						)
					);
				} else {
					return React.createElement(
						'span',
						{ onMouseEnter: self.enter, onMouseLeave: self.out, className: className, style: size, key: image },
						React.createElement('img', { src: image, width: width, height: height, style: style, key: image })
					);
				}
			} else if (loop) {
				if (getFilePathExtension(image) === "svg") {
					return React.createElement(
						'span',
						{ onMouseEnter: self.enterLoop, onMouseLeave: self.out, className: className, style: size, key: image },
						React.createElement(
							'span',
							{ className: 'svg_icon_wrapper loop', style: style, key: image },
							React.createElement(Isvg, { src: image, className: 'isvg', key: image })
						)
					);
				} else {
					return React.createElement(
						'span',
						{ onMouseEnter: self.enterLoop, onMouseLeave: self.out, className: className, style: size, key: image },
						React.createElement('img', { src: image, width: width, height: height, style: style, key: image })
					);
				}
			} else {
				if (getFilePathExtension(image) === "svg") {

					return React.createElement(
						VisibilitySensor,
						{ onChange: self.onVisible, key: image },
						React.createElement(
							'span',
							{ className: className, style: size },
							React.createElement(
								'span',
								{ className: 'svg_icon_wrapper play', style: style, key: image },
								React.createElement(Isvg, { src: image, className: 'isvg', key: image })
							)
						)
					);
				} else {
					return React.createElement(
						'span',
						{ className: className, style: size, key: image },
						React.createElement('img', { src: image, width: width, height: height, style: style, key: image })
					);
				}
			}
		}
	}
});