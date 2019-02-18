import React, { Component } from "react";
import Map from "./Map";

class Home extends Component {
  render() {
    return (
      <>
        <Map
          google={this.props.google}
          center={{ lat: 59.3251172, lng: 18.0710935 }}
          height="1000px"
          zoom={11}
        />
      </>
    );
  }
}

export default Home;
