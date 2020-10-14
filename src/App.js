import React, {Component} from 'react'
import GoogleMapSection from './GoogleMapSection'

class App extends Component {

  state = {
    searchLat: 43.653225,
    searchLng: -79.383186 
  }

  handleSearchLat = lat => {
    this.setState({
      searchLat: lat
    })
  }

  handleSearchLng = lng => {
    this.setState({
      searchLng: lng
    })
  }

  render() {

    const { searchLat, searchLng} = this.state

    return (
      <div>
        <GoogleMapSection
          searchLat={searchLat}
          searchLng={searchLng}
          handleSearchLat={this.handleSearchLat}
          handleSearchLng={this.handleSearchLng}
        />
        </div>
    )
  }
}

export default App