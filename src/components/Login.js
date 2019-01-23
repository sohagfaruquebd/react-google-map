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
    zoom: 25
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
      let url = `https://smartflowapi.eu-gb.mybluemix.net/device`;
      var basicAuth = 'Basic ' + btoa(username + ':' + password);
      console.log(basicAuth)
      let bodyRequest = {
        selector: {
          "deviceInfo.deviceClass": "DenHaag"
        }
      }
      let { data } = await axios.post(url, {
        "selector": {
        "deviceInfo.deviceClass" : "DenHaag" }
        }, { headers: { 'X-Yazamtec-Client-Id': "8bff1e7f-45e1-48e5-b63d-0b7b2d50a8b3" } });
      console.log("api data",data.docs)
      await data.docs.map(ibmData => {
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
        if (results[i].deviceInfo) {
          let type = results[i].metadata.Location_Class
          icon = {
            url: `../assets/marker_icons/an_${type}_green.png`, // url
            scaledSize: new this.state.mapApi.Size(30, 30), // scaled size
            origin: new this.state.mapApi.Point(0, 0), // origin
            anchor: new this.state.mapApi.Point(0, 0) // anchor
          };
          myLatLng = { lat: results[i].geometry.coordinates[1], lng: results[i].geometry.coordinates[0] };
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
          if (markerInfo.deviceInfo) {
            console.log(marker)
          var infowindow = new this.state.mapApi.InfoWindow({
            content: '<div id="content">' +
              '<div id="siteNotice">' +
              '</div>' +
              '<div id="bodyContent">' +
              '<div class="post-container"><div class="post-thumb"><img src="' + marker.icon + ' height="200" width="200" /></div><div class="post-content"><h3 class="post-title">'+ markerInfo.metadata.Street+'</h3><h3 class="post-title">'+ markerInfo.metadata.City+ '</h3><h3 class="post-title">Status: ' + '</h3><h3 class="post-title">Type: Parkerrgarage</h3></div></div><button class="custombutton button5" href="#">Take Me There</button>' +
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
    console.log(this.state, maps)
    return {
      mapTypeControl: true,
      fullscreenControl: false,
      mapTypeIds: ['roadmap', 'terrain'],
      mapTypeControlOptions: {
        style: this.state.mapApi ? this.state.mapApi.MapTypeControlStyle.DROPDOWN_MENU : null,
        // position: this.state.mapApi ? this.state.mapApi.ControlPosition.TOP_CENTER : null
    },
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
      <div className="map-canvas">


        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyAyIvCIJ8K57oZ0Hra-TPJWOAP8gjiJ7E8",
            libraries: ['places', 'geometry'],
          }}
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
          options={this.createMapOptions()}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
        {mapApiLoaded && <SearchBox map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />}

      </div>

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