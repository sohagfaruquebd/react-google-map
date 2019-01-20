import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux'
import SearchBox from './SearchBox';
import '../style.css'
import fetch from 'unfetch';
import axios from "axios"
let base64 = require('base-64');


const AnyReactComponent = ({ text }) => <div>{text}</div>;
class Login extends React.Component {
  static defaultProps = {
    center: {
      lat: 52.070499,
      lng: 4.3007
    },
    zoom: 11
  };
  constructor(props) {
    super(props);
    this.state = {
      isActiveModal: false,
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
      center: {
        lat: 52.070499,
        lng: 4.3007
      },
      zoom: 11,
      placeName: ""
    };
  }
  componentWillMount() {
    document.title = "Home";
  }
  handleApiLoaded = (map, maps) => {
    console.log(maps)
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
      parkData: []
    });
    this.populateMarker(this.state.center)
  };
  addPlace = async (place) => {

    this.setState({ places: place });
    let newState = { ...this.state }
    newState.center.lat = place[0].geometry.location.lat()
    newState.center.lng = place[0].geometry.location.lng()
    this.populateMarker(newState)
  };
  populateMarker = async (place) => {
    console.log("lat", place.lat, "lng", place.lng)

    var service = new this.state.mapApi.places.PlacesService(this.state.mapInstance);
    const pResult = await service.nearbySearch({
      // location: { lat: place[0].geometry.location.lat(), lng: place[0].geometry.location.lng() },
      location: this.state.center,
      radius: 1000,
      type: ['parking']
    }, async (results, status) => {
      results = [...results]
      console.log("google palce", results)
      let username = "imentstralliatherederess"
      let password = "9dea22ce6e159f2f7c9f709e7359660117006e8c"
      let url = `/newGeoIndex?lat=${place.lat}&lon=${place.lng}&radius=200&relation=contains&include_docs=true`;
      var basicAuth = 'Basic ' + btoa(username + ':' + password);
      console.log(basicAuth)

      let { data } = await axios.get(url, { headers: { 'Authorization': basicAuth } });
      console.log(data.rows)
      await data.rows.map(ibmData => {
        results.push(ibmData)
      })

      console.log("after push", results)
      // let ibmPlace = await fetch();
      console.log("marker pionts", results)
      let markers = []
      for (var i = 0; i < results.length; i++) {
        var myLatLng = { lat: -25.363, lng: 131.044 };
        let icon = {
          url: "../assets/menu_icons/google_parking.png", // url
          scaledSize: new this.state.mapApi.Size(30, 30), // scaled size
          origin: new this.state.mapApi.Point(0, 0), // origin
          anchor: new this.state.mapApi.Point(0, 0) // anchor
        };
        if (results[i].doc) {
          let type = results[i].doc.metadata.Location_Class
          icon = {
            url: `../assets/marker_icons/an_${type}_green.png`, // url
            scaledSize: new this.state.mapApi.Size(30, 30), // scaled size
            origin: new this.state.mapApi.Point(0, 0), // origin
            anchor: new this.state.mapApi.Point(0, 0) // anchor
          };
          myLatLng = { lat: results[i].doc.geometry.coordinates[1], lng: results[i].doc.geometry.coordinates[0] };
        } else {
          myLatLng = { lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng() }
        }

        let marker = new this.state.mapApi.Marker({
          map: this.state.mapInstance,
          position: myLatLng,
          animation: this.state.mapApi.Animation.DROP,
          icon: icon,
          size: new this.state.mapApi.Size(10, 10),
          markerInfo: results[i],
          // map: this.state.mapApi
        });
        marker.addListener('click', (d) => {

          let markerInfo = marker.markerInfo
          if (markerInfo.doc) {
            console.log(marker)
            var infowindow = new this.state.mapApi.InfoWindow({
              content: '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<div id="bodyContent">' +
                '<div class="post-container"><div class="post-thumb"><img src="' + marker.icon + ' height="200" width="200" /></div><div class="post-content"><h3 class="post-title">' + '</h3><h3 class="post-title">' + '</h3><h3 class="post-title">Status: ' + '</h3><h3 class="post-title">Type: Parkerrgarage</h3></div></div><button class="custombutton button5" href="#">Take Me There</button>' +
                '</div>' +
                '</div>'
            });
          } else {
            let imageUrl = markerInfo.photos ? markerInfo.photos[0].getUrl() : "";
            let openStatus = markerInfo.opening_hours ? markerInfo.opening_hours.open_now ? "Open" : "Gesloten" : ""
            var infowindow = new this.state.mapApi.InfoWindow({
              content: '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<div id="bodyContent">' +
                '<div class="post-container"><div class="post-thumb"><img src="' + imageUrl + ' height="200" width="200" /></div><div class="post-content"><h3 class="post-title">' + markerInfo.name + '</h3><h3 class="post-title">' + markerInfo.vicinity + '</h3><h3 class="post-title">Status: ' + openStatus + '</h3><h3 class="post-title">Type: Parkerrgarage</h3></div></div><button class="custombutton button5" href="#">Take Me There</button>' +
                '</div>' +
                '</div>'
            });
          }

          infowindow.open(this.state.mapApi, marker);
          console.log(markerInfo)
        }
        );

        markers.push(marker)
      }
    });
  }


  createMapOptions = (maps) => {
    return {
      mapTypeControl: true,
      mapTypeIds: ['roadmap', 'terrain']
    }
  }
  closeModal = () => {
    console.log("click close modal")
    this.setState({ isActiveModal: false })
  }
  render() {
    const {
      places, mapApiLoaded, mapInstance, mapApi,
    } = this.state;
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <span class="navbar-item" href="https://bulma.io">
          <input class="input" type="text" placeholder="Text input"/>
          </span>

          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
           
            <div class="navbar-item has-dropdown is-hoverable">
             
              <div class="navbar-dropdown">
               
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-light">
                <img src={require("../assets/menu_icons/valet_parking.png")} />
          </a>
                <a class="button is-light">
                <img src={require("../assets/menu_icons/valet_parking.png")} />
          </a>
                <a class="button is-light">
                <img src={require("../assets/menu_icons/valet_parking.png")} />
          </a>
                <a class="button is-light">
                <img src={require("../assets/menu_icons/valet_parking.png")} />
          </a>
                <a class="button is-light">
                <img src={require("../assets/menu_icons/valet_parking.png")} />
          </a>
                <a class="button is-light">
                <img src={require("../assets/menu_icons/valet_parking.png")} />
          </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
const mapStateToProps = state => ({
  isLoggedIn: state.auth.token
})

const mapDispatchToProps = dispatch => ({
  login: (token) => dispatch({ type: 'Store', token }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
// export default Login