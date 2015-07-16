var React = require('react');

var Webcam = React.createClass({
  render: function() {
    var name = this.props.name;
    var latitude = this.props.latitude;
    var longitude = this.props.longitude;
    var links = this.props.links;
    var totalCameras = this.props.cameras.length;
    var cameras = this.props.cameras.map(function(cam, index) {
      return (
        <li className="list-group-item" key={index}>
          <h5 className="list-group-item-heading">{cam.name}</h5>

          <img src={cam.url} />
        </li>
      );
    });
    return (
      <div>
        <h4>{name} - {totalCameras} cameras</h4>
        <ul className="list-group">
          {cameras}
        </ul>
      </div>
    )
  }
});

module.exports = Webcam;
