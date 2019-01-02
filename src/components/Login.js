import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux'
import SearchBox from './SearchBox';
import '../style.css'
const AnyReactComponent = ({ text }) => <div>{text}</div>;
class Login extends React.Component{
  static defaultProps = {
    center: {
      lat: 23.8103,
      lng: 90.4125
    },
    zoom: 11
  };
  constructor(props) {
    super(props);
    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
    };
  }
  componentWillMount () {
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
  };
  addPlace = async(place) => {
    console.log(place[0].geometry.location.lat())
    var service = new this.state.mapApi.places.PlacesService(this.state.mapInstance);
    const pResult = await service.nearbySearch({
      location: {lat: place[0].geometry.location.lat(), lng:  place[0].geometry.location.lng()},
      radius: 1000,
      type: ['parking']
    }, (results, status) => {
      for (var i = 0; i < results.length; i++) {
        // createMarker(results[i]);
        new this.state.mapApi.Marker({
          map: this.state.mapInstance,
          position: results[i].geometry.location
        });
      }
    });
    console.log(this.state)
    this.setState({ places: place });
  };
  
  createMapOptions = (maps) => {
    return {
      mapTypeControl: true,
      mapTypeIds: ['roadmap', 'terrain']
    }
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
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
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