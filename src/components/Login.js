import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux'
import SearchBox from './SearchBox';
import '../style.css'
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
    let newState = {...this.state}
    newState.center.lat = place[0].geometry.location.lat()
    newState.center.lng = place[0].geometry.location.lng()
    this.populateMarker(newState)
  };
  populateMarker = async(place) => {
    console.log("lat", place.lat, "lng", place.lng)
   
    var service = new this.state.mapApi.places.PlacesService(this.state.mapInstance);
    const pResult = await service.nearbySearch({
      // location: { lat: place[0].geometry.location.lat(), lng: place[0].geometry.location.lng() },
      location: this.state.center,
      radius: 1000,
      type: ['parking']
    }, (results, status) => {
      console.log("marker pionts",results)
      let markers =[]
      for (var i = 0; i < results.length; i++) {
        var icon = {
          url: "../assets/menu_icons/google_parking.png", // url
          scaledSize: new this.state.mapApi.Size(30, 30), // scaled size
          origin: new this.state.mapApi.Point(0,0), // origin
          anchor: new this.state.mapApi.Point(0, 0) // anchor
      };
       let marker = new this.state.mapApi.Marker({
          map: this.state.mapInstance,
          position: results[i].geometry.location,
          animation: this.state.mapApi.Animation.DROP,
          icon:icon,
          // size: new this.state.mapInstance.Size(20, 32),
          size: new this.state.mapApi.Size(10, 10),
          markerInfo: results[i],
          // map: this.state.mapApi
        });
        marker.addListener('click', (d) => {
          let markerInfo = marker.markerInfo
          this.setState({placeName: marker.markerInfo.name})
         let imageUrl = markerInfo.photos ? markerInfo.photos[0].getUrl() : "";
          var infowindow = new this.state.mapApi.InfoWindow({
            content: '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the '+
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
            'south west of the nearest large town, Alice Springs; 450&#160;km '+
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
            'Aboriginal people of the area. It has many springs, waterholes, '+
            'rock caves and ancient paintings. Uluru is listed as a World '+
            'Heritage Site.</p>'+
            '<p>Attribution: Uluru, <img src= '+imageUrl+'>'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>'
          });
          infowindow.open(this.state.mapApi, marker);
          console.log(marker)
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
    this.setState({isActiveModal: false})
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