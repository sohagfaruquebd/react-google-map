import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux'
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
      form: {
        userName: '',
        password: ''
      },
    };
  }
  componentWillMount () {
    document.title = "Login";
  }
  
  render() {
    return (
     <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAyIvCIJ8K57oZ0Hra-TPJWOAP8gjiJ7E8" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
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