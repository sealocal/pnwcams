var React = require('react');
var Router = require('react-router');

var Webcams = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {
      locations: []
    }
  },
  render: function() {
    var terrain = this.getParams().terrain;
    return (
      <div className="row">
        <div className="col-md-6">
          {terrain} Cameras
        </div>
        <div className="col-md-6">
          Camera 2
        </div>
      </div>
    );
  }
});

module.exports = Destination;
