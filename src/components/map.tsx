'use client'
import 'leaflet/dist/leaflet.css'
import { useCallback, useState } from 'react'

import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

L.Icon.Default.mergeOptions({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
})

const MapClickHandler = ({ setPosition }: { setPosition: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
    },
  })

  return null
}

const Map = () => {
  const [position, setPosition] = useState<[number, number]>([35.7219, 51.3347])

  const handleDragEnd = useCallback((e: L.DragEndEvent) => {
    const marker = e.target
    const latlng = marker.getLatLng()

    setPosition([latlng.lat, latlng.lng])
  }, [])

  return (
    <div className="size-[400px]">
      <MapContainer className="size-full" center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=fZ0yuQbBs2ZcnSEyK7mbVIjxmGiCHJcG2Q1ojLiAaPS71jHlE5IUhflmr0ytvj43"
        />

        {/* 👇 This invisible component listens for map clicks */}
        <MapClickHandler setPosition={setPosition} />

        <Marker
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: handleDragEnd,
          }}
        >
          {/*<Popup>
            📍 Marker at:
            <br />
            <strong>{position[0].toFixed(5)}</strong>, <strong>{position[1].toFixed(5)}</strong>
          </Popup>*/}
        </Marker>
      </MapContainer>
    </div>
  )
}

export default Map
