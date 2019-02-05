import React, { Component } from "react";
import Map from "./Map";

class Home extends Component {
  render() {
    return (
      <div style={{ margin: "100px" }}>
        <Map
          google={this.props.google}
          center={{ lat: 59.3251172, lng: 18.0710935 }}
          height="300px"
          zoom={11}
        />
      </div>
    );
  }
}

export default Home;
