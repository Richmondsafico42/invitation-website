import melPhoto from './assets/mel.svg'
import vicPhoto from './assets/vic.svg'

// Edit these details to customize the invitation.
export const eventConfig = {
  // Dual celebrants — 60th birthday & 32nd wedding anniversary
  celebrants: ['Mel', 'Vic'],
  age: 60,
  weddingYears: 32,
  title: "You're Cordially Invited",
  subtitle: 'Celebrating a 60th Birthday & 32 Years of Wedding Anniversary',
  // ISO date string for the party (used for the countdown)
  dateISO: '2026-07-18T16:30:00',
  dateLabel: 'Saturday, July 18, 2026',
  timeLabel: '4:30 PM onwards',
  venue: 'CASA ESMERALDA',
  address: 'Purok 5, Bacolor, 2001 Pampanga',
  dressCode: 'Ladies: Pink · Gentlemen: Blue',
  note: 'Join us as we celebrate a 60th birthday and 32 beautiful years of wedding anniversary.',
  // Map coordinates for venue (lat, lng)
  mapLat: 14.991236140873456,
  mapLng: 120.6429018329377,
  mapZoom: 17,
  // Celebrant photos — individual images (no background, standing to the side)
  celebrantProfiles: [
    {
      name: 'Mel',
      fullName: 'Imelda Serrano',
      tagline: '60th birthday celebrant',
      photo: melPhoto,
    },
    {
      name: 'Vic',
      fullName: 'Victoriano Serrano',
      tagline: '32nd anniversary celebrant',
      photo: vicPhoto,
    },
  ],
}

