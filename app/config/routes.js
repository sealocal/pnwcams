var React = require('react');
var Main = require('../components/Main');
var Home = require('../components/Home');
var Terrain = require('../components/Terrain');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

module.exports = (
  <Route name="app" path="/" handler={Main}>
    <Route name="terrain" path=":terrain" handler={Terrain} />
    <DefaultRoute handler={Home} />
  </Route>
);
