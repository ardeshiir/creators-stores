'use client'
import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useState } from 'react'

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude])
        },
        (err) => {
          console.warn('📍 Geolocation not available or permission denied:', err)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    }
  }, [])

  return (
    <div className="size-full">
      <MapContainer className="z-10 size-full" center={position} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=fZ0yuQbBs2ZcnSEyK7mbVIjxmGiCHJcG2Q1ojLiAaPS71jHlE5IUhflmr0ytvj43"
        />

        <MapClickHandler setPosition={setPosition} />

        <Marker position={position} draggable={true} eventHandlers={{ dragend: handleDragEnd }} />
      </MapContainer>
    </div>
  )
}

export default Map
