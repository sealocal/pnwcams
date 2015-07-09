var React = require('react');
var Router = require('react-router');
var Webcams = require('../components/Webcams/Webcams');

var Terrain = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {
      destinations: ['Westport', 'La Push']
    }
  },
  render: function() {
    var terrain = this.getParams().terrain;
    return (
      <div id={terrain}>
        <div className="section-card">
          <h1>{terrain} Cams</h1>
        </div>
        <Webcams destinations={this.state.destinations} />
      </div>
    );
  }
});

module.exports = Terrain;
