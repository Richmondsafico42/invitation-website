export default function VenueMap({ lat, lng, venue, address }) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.003},${lng + 0.005},${lat + 0.003}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="venue-map">
      <iframe
        title={`Map to ${venue}`}
        src={src}
        loading="lazy"
        allowFullScreen
      />
      <a
        className="venue-map-link"
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        🚗 Get Directions to {venue} ({address})
      </a>
    </div>
  )
}
