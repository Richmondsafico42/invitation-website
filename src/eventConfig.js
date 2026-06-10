// Edit these details to customize the invitation.
export const eventConfig = {
  // Dual celebrants — 60th birthday & 32nd wedding anniversary
  celebrants: ['Mel', 'Vic'],
  age: 60,
  weddingYears: 32,
  title: "You're Cordially Invited",
  subtitle: 'Celebrating 60 Years of Purpose & 32 Years of Promise',
  // ISO date string for the party (used for the countdown)
  dateISO: '2026-07-18T16:30:00',
  dateLabel: 'Saturday, July 18, 2026',
  timeLabel: '4:30 PM onwards',
  venue: 'The Garden Terrace',
  address: '123 Celebration Ave, Manila',
  dressCode: 'Ladies: Pink · Gentlemen: Blue',
  note: 'Come celebrate six decades of life and thirty-two years of love with us!',
  // Map coordinates for venue (lat, lng)
  mapLat: 14.5995,
  mapLng: 120.9842,
  mapZoom: 16,
  // Celebrant photos — individual images (no background, standing to the side)
  celebrantProfiles: [
    {
      name: 'Mel',
      fullName: 'Imelda Serrano',
      tagline: '60 years of purpose',
      photo: '/celebrants/maria.svg',
    },
    {
      name: 'Vic',
      fullName: 'Victoriano Serrano',
      tagline: '60 years of promise',
      photo: '/celebrants/jose.svg',
    },
  ],
}
