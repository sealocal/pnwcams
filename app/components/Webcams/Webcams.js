var React = require('react');

var Webcams = React.createClass({
  render: function() {
    return (
      <div>
        Webcams <br />
        Destinations {this.props.destinations}
      </div>
    );
  }
});

module.exports = Webcams;
