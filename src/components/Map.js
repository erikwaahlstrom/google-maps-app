import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker
} from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from "react-google-autocomplete";
Geocode.setApiKey("AIzaSyA2z9wPZtKS9NkmFnAQSupuzt8qTbrpNf8");
Geocode.enableDebug();

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveAddress: [],
      address: "",
      city: "",
      area: "",
      state: "",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      }
    };
  }
  /* Get the current address from the default map position and set those values in the state */
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : ""
        });
      },
      error => {
        console.error(error);
      }
    );
  }
  /* Get the city and set the city input value to the one selected */
  getCity = addressArray => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "postal_town" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /* Get the area and set the area input value to the one selected */
  getArea = addressArray => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /* Get the address and set the address input value to the one selected */
  getState = addressArray => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /* And function for city,state and address input */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /* This Event triggers when the marker window is closed */
  onInfoWindowClose = event => {};

  /* When the marker is dragged you get the lat and long using the functions available from event object. Use geocode to get the address, city, area and state from the lat and lng positions. And then set those values in the state. */
  onMarkerDragEnd = event => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);
        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : ""
        });
      },
      error => {
        console.error(error);
      }
    );
  };

  /* When the user types an address in the search box */
  onPlaceSelected = place => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue
      }
    });
  };
  /*  */
  changeLocation = event => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng).then(response => {
      const address = response.results[0].formatted_address,
        addressArray = response.results[0].address_components,
        city = this.getCity(addressArray),
        area = this.getArea(addressArray),
        state = this.getState(addressArray);
      this.setState({
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: newLat,
          lng: newLng
        }
      });
    });
  };

  saveLocation(e) {
    e.preventDefault();
    const { saveAddress } = this.state;
    const newAddress = this.newAddress.value;

    this.setState({
      saveAddress: [...saveAddress, newAddress]
    });
  }
  listItemClick = event => {
    console.log("listItemClick");
  };
  render() {
    const { saveAddress } = this.state;
    const AsyncMap = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          google={this.props.google}
          onClick={this.changeLocation}
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng
          }}
        >
          <InfoWindow
            onClose={this.onInfoWindowClose}
            position={{
              lat: this.state.markerPosition.lat + 0.0018,
              lng: this.state.markerPosition.lng
            }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>
                {this.state.address}
              </span>
            </div>
          </InfoWindow>
          <Marker
            google={this.props.google}
            name={"Dolores park"}
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng
            }}
          />
          <Marker />
          <Autocomplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "16px",
              marginTop: "2px",
              marginBottom: "100px"
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["establishment"]}
            componentRestrictions={{ country: "SE" }}
          />
        </GoogleMap>
      ))
    );
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <>
          <form
            onSubmit={e => {
              this.saveLocation(e);
            }}
          >
            <button type="submit">Save</button>
            <div className="form-group">
              <label htmlFor="">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.city}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Area</label>
              <input
                type="text"
                name="area"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.area}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.state}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.address}
                ref={input => (this.newAddress = input)}
              />
            </div>
          </form>
          <div className="flex-grid-wrapper">
            <div className="flex-grid">
              <div className="col">
                <AsyncMap
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2z9wPZtKS9NkmFnAQSupuzt8qTbrpNf8&libraries=places"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={
                    <div style={{ height: this.props.height }} />
                  }
                  mapElement={<div style={{ height: `100%` }} />}
                />
              </div>
              <div className="col2">
                <ul>
                  {saveAddress.map((item, i) => {
                    return (
                      <li key={i}>
                        <button
                          onClick={event => {
                            this.listItemClick(event);
                          }}
                          key={i}
                        >
                          {item}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}
export default Map;
