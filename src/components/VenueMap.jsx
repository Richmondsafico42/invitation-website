export default function VenueMap({ lat, lng, venue }) {
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
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps
      </a>
    </div>
  )
}
