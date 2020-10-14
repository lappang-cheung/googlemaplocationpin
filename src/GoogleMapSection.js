import React, { useCallback } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker
} from '@react-google-maps/api'

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete'

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption
} from '@reach/combobox'

import '@reach/combobox/styles.css'

const GoogleMapSection = ({ searchLat, 
  searchLng, handleSearchLat, handleSearchLng}) => {

  const libraries = ['places']
  const mapContainerStyle = {
    width: '100vw',
    height: '100vh'
  }
  const center = {
    lat: searchLat,
    lng: searchLng
  }

  const options = {
    disabledDefaultUI: true,
    zoomControl: true
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDnCkNAk5J0x61NEITiZBiG4G5OXwBpk8c',
    libraries
  })

  const Search = ({ panTo, handleSearchLat, handleSearchLng }) => {
  const { ready, value, suggestions: {status, data}, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => 43.653225,
        lng: () => -79.383186
      },
      radius: 200 * 1000
    }
  })

  return <Combobox
    onSelect={async (address) => {
      setValue(address, false)
      clearSuggestions()
      try {
        const results = await getGeocode({ address })
        const { lat, lng } = await getLatLng(results[0])
        handleSearchLat(lat)
        handleSearchLng(lng)
        panTo({ lat, lng })
      } catch (err) {
        console.error(err)
      }
      console.log(address)
      }}
    >
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        disabled={!ready}
        placeholder={'Enter an address'}
      />
      <ComboboxPopover>
        { status === 'OK' && data.map(({id, description}) => {
          return <ComboboxOption key={id} value={description} />
        })}
      </ComboboxPopover>
    </Combobox>
  }
  
  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  })

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(14)
  }, [])

  if (loadError) return "Error loading maps"
  if (!isLoaded) return "Loading maps"

  return (
    <div>
      <Search
        handleSearchLat={handleSearchLat}
        handleSearchLng={handleSearchLng}
        panTo={panTo}
      />
      <GoogleMap
        id='map'
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {console.log(searchLat)}
        <Marker
          position={{ lat: searchLat, lng: searchLng }}
        />
      </GoogleMap>
    </div>
  );
}

export default GoogleMapSection