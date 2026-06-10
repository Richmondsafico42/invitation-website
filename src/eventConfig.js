// Edit these details to customize the invitation.
export const eventConfig = {
  // Dual celebrants for a joint 60th birthday
  celebrants: ['Maria', 'Jose'],
  age: 60,
  title: "You're Cordially Invited",
  // ISO date string for the party (used for the countdown)
  dateISO: '2026-08-15T18:00:00',
  dateLabel: 'Saturday, August 15, 2026',
  timeLabel: '6:00 PM – 11:00 PM',
  venue: 'The Garden Terrace',
  address: '123 Celebration Ave, Manila',
  dressCode: 'Ladies: Pink · Gentlemen: Blue',
  note: 'Come celebrate six decades of love, life, and laughter with us!',
  // Map coordinates for venue (lat, lng)
  mapLat: 14.5995,
  mapLng: 120.9842,
  mapZoom: 16,
  // Celebrant photos — replace with real .jpg/.png paths in public/celebrants/
  celebrantProfiles: [
    {
      name: 'Maria',
      tagline: '60 years of grace',
      photo: '/celebrants/maria.svg',
    },
    {
      name: 'Jose',
      tagline: '60 years of joy',
      photo: '/celebrants/jose.svg',
    },
  ],
}
