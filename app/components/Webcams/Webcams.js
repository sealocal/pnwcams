var React = require('react');
var Router = require('react-router');
var ReactFireMixin = require('reactfire');
var Firebase = require('firebase');
var Webcam = require('./Webcam');

var Webcams = React.createClass({
  mixins: [Router.State, ReactFireMixin],
  getInitialState: function() {
    return {
      locations: []
    };
  },
  componentDidMount: function() {
    this.ref = new Firebase('https://pnwcams.firebaseio.com/locations');
    var childRef = this.ref.child(this.getParams().terrain);
    this.bindAsArray(childRef, 'locations');
  },
  componentWillUnmount: function() {
    this.unbind('locations');
  },
  render: function() {
    var locations = this.state.locations;
    var webcams = locations.map(function(location, index) {
      return <Webcam name={location.name} latitude={location.latitude} longitude={location.longitude} links={location.links} cameras={location.cameras} />;
    });
    return (
      <div>
        <h3>Locations for {this.props.terrain}</h3>
        {webcams}
      </div>
    );
  }
});

module.exports = Webcams;
