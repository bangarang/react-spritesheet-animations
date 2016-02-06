var React = require('react');
var util = require('util');
var Isvg = require('react-inlinesvg');
var VisibilitySensor = require('react-visibility-sensor');
var TimerMixin = require('react-timer-mixin');

function getFilePathExtension(path) {
	var filename = path.split('\\').pop().split('/').pop();
	return filename.substr(( Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
}

module.exports = React.createClass({
	mixins: [TimerMixin],
  getInitialState: function() {
    return { animation: "start", current_frame: 0, x: 0, y: 0, interval: {}, timer: {} }
  },

	getDefaultProps: function() {
		return { hover: true, loop: false, play: false }
	},

	componentWillMount: function(){
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

  componentDidMount: function(){
		var self = this;
    self.animate();
  },

  componentWillUnmount: function(){
    this.setState({animation: "stop"});
		this.cancelAnimationFrame();
  },

  enter: function()	{
		var self = this;
    self.setState({animation: "forward"});
	},

  out: function()	{
		var self = this;
    self.setState({animation: "reverse"});
	},

	enterLoop: function()	{
		this.setState({animation: "startloop"});
	},

	outLoop: function()	{
		this.setState({animation: "stoploop"});
	},

	play: function()	{
		this.setState({animation: "play"});
	},

	reset: function()	{
		this.setState({animation: "stoploop"});
	},

	onVisible: function (isVisible) {
		var self = this;
		if (isVisible){
			self.play();
		} else {
			self.reset();
		};
	},

	animation: function(){
		var self = this;

		self.requestAnimationFrame(self.animate);

		if ( self.state.animation == "start") {
		}

		if (( self.state.animation == "forward") && (self.state.current_frame != self.props.frames - 1 ) ) {
				var new_frame = self.state.current_frame + 1;
				var col = (new_frame % self.props.columns) + 1;
				var row = Math.floor( ( new_frame ) / self.props.columns ) + 1;

				var x = (col - 1) * self.props.frameW * -1;
				var y = (row - 1) * self.props.frameH * -1;
				self.setState( { current_frame: new_frame, x: x, y: y } );
		}

		if ( (self.state.animation == "reverse")  && (self.state.current_frame != 0) ) {
				var new_frame = self.state.current_frame - 1;
				var col = (new_frame % self.props.columns) + 1;
				var row = Math.floor( ( new_frame ) / self.props.columns ) + 1;

				var x = (col - 1) * self.props.frameW * -1;
				var y = (row - 1) * self.props.frameH * -1;
				self.setState( { current_frame: new_frame, x: x, y: y } );
		}

		if (( self.state.animation == "startloop")) {
			if (self.state.current_frame == self.props.frames - 1 ) {
				self.setState( { current_frame: 0, x: 0, y: 0 } );
			} else {
				var new_frame = self.state.current_frame + 1;
				var col = (new_frame % self.props.columns) + 1;
				var row = Math.floor( ( new_frame ) / self.props.columns ) + 1;

				var x = (col - 1) * self.props.frameW * -1;
				var y = (row - 1) * self.props.frameH * -1;
				self.setState( { current_frame: new_frame, x: x, y: y } );
			}
		}

		if ((self.state.animation == "play") ) {
			if (self.state.current_frame == self.props.frames - 1 ) {
				self.setState( { animation: "start" } );
			} else {
				var new_frame = self.state.current_frame + 1;
				var col = (new_frame % self.props.columns) + 1;
				var row = Math.floor( ( new_frame ) / self.props.columns ) + 1;

				var x = (col - 1) * self.props.frameW * -1;
				var y = (row - 1) * self.props.frameH * -1;
				self.setState( { current_frame: new_frame, x: x, y: y } );
			}
		}

		if (( self.state.animation == "stoploop")) {
			self.setState( { current_frame: 0, x: 0, y: 0 } );
		}
	},

  animate: function(){
		var self = this;
    var speed = Math.floor( ( 1000 * self.props.duration ) / self.props.frames);

    self.setTimeout(self.animation, speed );


	},

  render: function() {
    var self = this;

    var image = self.props.image,
				width = self.props.frameW * self.props.columns,
				hover = self.props.hover,
				loop = self.props.loop,
				play = self.props.play,
				height = self.props.frameH * ( Math.ceil( self.props.frames / self.props.columns ) );

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
      width: self.props.frameW + "px",
    };


		if (image){
			if (hover){
				if ((getFilePathExtension(image) === "svg")){
		      return (
		        <span onMouseEnter={self.enter} onMouseLeave={self.out} className={className} style={size} key={image} >
		          <span className="svg_icon_wrapper" style={style} key={image}>
		            <Isvg src={image} className="isvg" key={image}></Isvg>
		          </span>
		        </span>
		      )
		    } else {
		      return (
		        <span onMouseEnter={self.enter} onMouseLeave={self.out} className={className} style={size} key={image} >
		          <img src={image} width={width} height={height} style={style} key={image} />
		        </span>
		      )
		    }
			} else if (loop){
				if ((getFilePathExtension(image) === "svg")){
					return (
						<span onMouseEnter={self.enterLoop} onMouseLeave={self.out} className={className} style={size} key={image} >
							<span className="svg_icon_wrapper loop" style={style} key={image} >
								<Isvg src={image} className="isvg" key={image}></Isvg>
							</span>
						</span>
					)
				} else {
					return (
						<span onMouseEnter={self.enterLoop} onMouseLeave={self.out} className={className} style={size} key={image} >
							<img src={image} width={width} height={height} style={style} key={image} />
						</span>
					)
				}
			} else {
				if ((getFilePathExtension(image) === "svg")){

		      return (
						<VisibilitySensor onChange={self.onVisible} key={image}>
			        <span className={className} style={size} >
			          <span className="svg_icon_wrapper play" style={style} key={image} >
			            <Isvg src={image} className="isvg" key={image}></Isvg>
			          </span>
			        </span>
						</VisibilitySensor>
		      )
		    } else {
		      return (
		        <span className={className} style={size} key={image}>
		          <img src={image} width={width} height={height } style={ style } key={image} />
		        </span>
		      )
		    }
			}
		}
	}
});
