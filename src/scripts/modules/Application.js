import locationTemplate from 'templates/location.hbs';
import weatherTemplate from 'templates/weather.hbs';
import _ from 'underscore';

/**
 * PNW Cams - http://www.pnwcams.com
 * @module  modules/Application
 * @author  brian@brainbrian.com - http://www.brainbrian.com
 */
const Application = {
  /**
   * Configuration for application
   * @type {Object}
   */
  config: {
    data: null,
    appId: 'aedd7de81c14d670e877d39ead4ed7b4',
    weatherApi: 'http://api.openweathermap.org/data/2.5/weather'
  },

  /**
   * User interface object for caching DOM elements
   * @type {Object}
   */
  ui: {},

  /**
   * Initialize the application
   */
  init: function() {
    this.ui = {
      locations: $('#locations'),
      location: null,
      navBtns: $('.header__nav-btn'),
      cameras: null
    };
    this._requestData();
  },

  /**
   * Request json data for locations
   */
  _requestData: function() {
    $.ajax({
      dataType: "json",
      url: '/assets/json/data.json',
      success: function(data) {
        var hash = window.location.hash.replace('#', '');
        var cat = 'surf';
        if(hash === 'snow' || hash === 'surf') cat = hash;
        this.config.data = data;
        this._bindEvents();
        this._buildLocations(this.config.data, cat);
      }.bind(this)
    });
  },

  /**
   * Bind event listeners for nav items
   */
  _bindEvents: function() {
    this.ui.navBtns.on('click', function(e) {
      var target = e.target,
        $parent = $(target).parent(),
        category = $parent.data('cat');
      if(this.config.category !== category) this._buildLocations(this.config.data, category);
    }.bind(this));
  },

  /**
   * Build locations based on data
   * @param  {[type]} data     Location data
   * @param  {[type]} category Location category
   */
  _buildLocations: function(data, category) {
    var locationHtml;
    this.ui.navBtns.removeClass('header__nav-btn--active');
    if(category === 'surf') {
      locationHtml = locationTemplate({'locations': _.where(data.locations, {category: "surf"})});
      $('.header__nav-btn[data-cat="surf"]').addClass('header__nav-btn--active');
    } else {
      // default to snow
      locationHtml = locationTemplate({'locations': _.where(data.locations, {category: "snow"})});
      $('.header__nav-btn[data-cat="snow"]').addClass('header__nav-btn--active');
    }
    this._destroyCarousels();
    this.ui.locations.html('');
    this.ui.locations.html(locationHtml);
    this.ui.location = this.ui.locations.find('.location');
    this.ui.cameras = this.ui.locations.find('.cameras');
    this._randomImgLoad();
    this._buildWeather();
    this._buildCarousels();
    document.body.scrollTop = 0;
  },

  /**
   * Make images load randomly to prevent caching
   */
  _randomImgLoad: function() {
      var $images = $('.owl-lazy');
      $images.each(function(index) {
          var $image = $($images[index]);
          var imgUrl = $image.data('src');
          imgUrl = imgUrl.indexOf('?') > -1 ? imgUrl + '&' : imgUrl + '?';
          imgUrl += "random=" + Math.round(Math.random() * 100000000);
          $image.attr('data-src', imgUrl);
      }.bind(this));
  },

  /**
   * Build weather data for each location
   */
  _buildWeather: function() {
    this.ui.location.each(function(index) {
      var $location = $(this.ui.location[index]);
      var latitude = String($location.data('latitude'));
      var longitude = String($location.data('longitude'));
      var requestData = {
        units: 'imperial',
        lat: latitude,
        lon: longitude,
        appid: this.config.appId
      };
      var addWeatherData = function(data) {
        var $titleCard = $(this.ui.location[index]).find('.title-card');
        var forecastUrl = 'http://forecast.weather.gov/MapClick.php?lat=' + latitude + '&lon=' + longitude;
        // define weather data obj
        var weatherData = {
          forecastUrl: forecastUrl
        };
        if(data.main && data.main.temp) weatherData.temp = data.main.temp;
        if(data.wind) {
          if(data.wind.speed) weatherData.windSpeed = data.wind.speed;
          if(data.wind.degree) weatherData.windDirection = data.wind.degree;
        }
        if(data.clouds && data.clouds.all) weatherData.clouds = data.clouds.all;
        if(data.rain && data.rain['3h']) weatherData.rain = data.rain['3h'];
        if(data.snow && data.snow['3h']) weatherData.snow = data.snow['3h'];
        // build and add html
        var weatherHtml = weatherTemplate(weatherData);
        $titleCard.append(weatherHtml);
      };
      $.ajax({
        cache: true,
        context: this,
        data: requestData,
        dataType: "json",
        url: this.config.weatherApi,
        success: addWeatherData
      });
    }.bind(this));
  },

  /**
   * Build Owl Carousels
   */
  _buildCarousels: function() {
    this.ui.cameras.each(function(index) {
      var $carousel = $(this.ui.cameras[index]);
      var $camera = $carousel.find('.camera');
      var settings = {};
      // console.log($camera.length);
      if($camera.length > 1) {
        // set up owl carousels
        settings = {
          items: 1,
          dots: true,
          lazyLoad: true,
          autoplay: false,
          autoplayTimeout: 8000,
          autoplayHoverPause: true,
          loop: true
        };
      } else {
        // set up owl carousels
        settings = {
          items: 1,
          dots: false,
          lazyLoad: true,
          autoplay: false,
          loop: false
        };
      }
      // set up owl carousels
      $carousel.owlCarousel(settings);
    }.bind(this));
  },

  /**
   * Destroy Owl Carousels
   */
  _destroyCarousels: function() {
      if(this.ui.cameras !== null) this.ui.cameras.trigger('destroy.owl.carousel');
  }
};

export default Application;
