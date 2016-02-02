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

	componentWillMount: function componentWillMount() {
		// var timer = {
		//     running: false,
		//     iv: 5000,
		//     timeout: false,
		//     cb : function(){},
		//     start : function(cb,iv){
		//         var elm = this;
		//         clearInterval(this.timeout);
		//         this.running = true;
		//         if(cb) this.cb = cb;
		//         if(iv) this.iv = iv;
		//         this.timeout = setTimeout(function(){elm.execute(elm)}, this.iv);
		//     },
		//     execute : function(e){
		//         if(!e.running) return false;
		//         e.cb();
		//         e.start();
		//     },
		//     stop : function(){
		//         this.running = false;
		//     },
		//     set_interval : function(iv){
		//         clearInterval(this.timeout);
		//         this.start(false, iv);
		//     }
		// };
		//
		// this.setState({timer: timer})
	},

	componentDidMount: function componentDidMount() {
		var self = this;
		self.animate();
	},

	componentWillUnmount: function componentWillUnmount() {
		this.setState({ animation: "stop" });
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

	animate: function animate() {
		var self = this;
		var speed = 1000 * self.props.duration / self.props.frames;

		self.setTimeout(function () {

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
		}, speed);
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
						{ onMouseEnter: self.enter, onMouseLeave: self.out, className: className, style: size },
						React.createElement(
							'span',
							{ className: 'svg_icon_wrapper', style: style },
							React.createElement(
								Isvg,
								{ src: image, className: 'isvg' },
								'Here\'s some optional content for browsers that don\'t support XHR or inline SVGs. You can use other React components here too. Here, I\'ll show you.'
							)
						)
					);
				} else {
					return React.createElement(
						'span',
						{ onMouseEnter: self.enter, onMouseLeave: self.out, className: className, style: size },
						React.createElement('img', { src: image, width: width, height: height, style: style })
					);
				}
			} else if (loop) {
				if (getFilePathExtension(image) === "svg") {
					return React.createElement(
						'span',
						{ onMouseEnter: self.enterLoop, onMouseLeave: self.out, className: className, style: size },
						React.createElement(
							'span',
							{ className: 'svg_icon_wrapper loop', style: style },
							React.createElement(
								Isvg,
								{ src: image, className: 'isvg' },
								'Here\'s some optional content for browsers that don\'t support XHR or inline SVGs. You can use other React components here too. Here, I\'ll show you.'
							)
						)
					);
				} else {
					return React.createElement(
						'span',
						{ onMouseEnter: self.enterLoop, onMouseLeave: self.out, className: className, style: size },
						React.createElement('img', { src: image, width: width, height: height, style: style })
					);
				}
			} else {
				if (getFilePathExtension(image) === "svg") {

					var onChange = function onChange(isVisible) {
						if (isVisible) {
							self.play();
						} else {
							self.reset();
						};
					};

					return React.createElement(
						VisibilitySensor,
						{ onChange: onChange },
						React.createElement(
							'span',
							{ className: className, style: size },
							React.createElement(
								'span',
								{ className: 'svg_icon_wrapper play', style: style },
								React.createElement(
									Isvg,
									{ src: image, className: 'isvg' },
									'Here\'s some optional content for browsers that don\'t support XHR or inline SVGs. You can use other React components here too. Here, I\'ll show you.'
								)
							)
						)
					);
				} else {
					return React.createElement(
						'span',
						{ className: className, style: size },
						React.createElement('img', { src: image, width: width, height: height, style: style })
					);
				}
			}
		}
	}
});