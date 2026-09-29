// All site content that is facts, not code. Coordinates are [lat, lon].
// Trench and fault traces are simplified/approximate for a classroom map.

export const TRENCHES = [
  {
    name: 'Philippine Trench',
    type: 'Subduction: Philippine Sea Plate dives WEST under the islands',
    info: 'About 1,300 km long and over 10 km deep (Galathea Depth). Source of the 2012 Samar, '
      + '2023 Hinatuan and 2025 Davao Oriental earthquakes. This is the trench in our 3D model.',
    focus: true,
    line: [[14.0, 125.0], [12.5, 125.9], [10.5, 126.6], [8.5, 127.0], [6.5, 127.0],
      [5.0, 127.3], [3.5, 127.9]],
  },
  {
    name: 'Manila Trench',
    type: 'Subduction: South China Sea (Eurasian Plate) dives EAST under Luzon',
    info: 'Runs from Taiwan to Mindoro and feeds the volcanoes of western Luzon, including '
      + 'Pinatubo. Scientists consider it capable of large tsunami-generating earthquakes.',
    line: [[21.5, 120.0], [19.5, 119.3], [17.5, 119.1], [16.0, 119.3], [14.5, 119.7],
      [13.3, 120.3]],
  },
  {
    name: 'East Luzon Trough',
    type: 'Young subduction zone east of Luzon',
    info: 'A smaller, younger boundary where the Philippine Sea Plate is beginning to subduct.',
    line: [[18.2, 123.4], [17.0, 123.0], [15.8, 122.8], [15.0, 123.0]],
  },
  {
    name: 'Negros Trench',
    type: 'Subduction: Sulu Sea plate dives EAST under Negros and Panay',
    info: 'Feeds the Negros volcanic arc, including Kanlaon.',
    line: [[11.2, 121.9], [10.3, 122.2], [9.4, 122.5], [8.8, 122.6]],
  },
  {
    name: 'Sulu Trench',
    type: 'Subduction beneath the Zamboanga Peninsula',
    info: 'Marks the southeastern edge of the Sulu Sea.',
    line: [[8.4, 122.1], [7.8, 121.4], [7.2, 120.6], [6.7, 119.9]],
  },
  {
    name: 'Cotabato Trench',
    type: 'Subduction: Celebes Sea plate dives EAST under Mindanao',
    info: 'Produced the 1918 Celebes Sea (M8.3) and 1976 Moro Gulf (M8.0) earthquakes, '
      + 'both with deadly tsunamis.',
    line: [[7.4, 123.4], [6.5, 123.6], [5.7, 124.1], [5.0, 124.6]],
  },
];

export const FAULTS = [
  {
    name: 'Philippine Fault Zone',
    type: 'Strike-slip fault (blocks slide past each other sideways)',
    info: 'About 1,200 km long, slicing the islands from Luzon to Mindanao. It absorbs part of '
      + 'the squeeze from the Philippine Sea Plate. Caused the 1990 Luzon M7.7 earthquake.',
    line: [[18.0, 120.8], [16.6, 121.0], [15.8, 121.2], [14.7, 121.6], [13.8, 122.5],
      [12.3, 123.5], [11.0, 124.9], [10.0, 125.2], [8.5, 126.1], [7.0, 126.3]],
  },
  {
    name: 'West Valley Fault',
    type: 'Active fault under Metro Manila',
    info: 'Source of the feared "Big One." A M7.2 scenario study (MMEIRS) estimated up to '
      + '~34,000 deaths in Metro Manila.',
    line: [[14.85, 121.07], [14.62, 121.1], [14.5, 121.07], [14.3, 121.04], [14.2, 121.0]],
  },
];

export const PLATES = [
  { name: 'Philippine Sea Plate', at: [13.5, 130.5], arrow: '⟵', note: 'moving west-northwest' },
  { name: 'Eurasian Plate (Sunda)', at: [13.5, 115.5], arrow: '⟶', note: 'pushing east' },
];

// Magnitudes can differ slightly between PHIVOLCS and USGS. Locations approximate.
export const QUAKES = [
  { name: 'Celebes Sea', year: 1918, m: 8.3, at: [5.6, 123.0], src: 'Cotabato Trench',
    note: 'One of the largest in Philippine history; tsunami struck Mindanao coasts.' },
  { name: 'Casiguran', year: 1968, m: 7.6, at: [16.3, 122.1], src: 'East of Luzon',
    note: 'Collapsed the Ruby Tower in Manila, over 200 km away.' },
  { name: 'Moro Gulf', year: 1976, m: 8.0, at: [6.29, 124.09], src: 'Cotabato Trench',
    note: 'Tsunami killed thousands (estimates 5,000–8,000).' },
  { name: 'Luzon', year: 1990, m: 7.7, at: [15.68, 121.17], src: 'Philippine Fault',
    note: 'About 1,600 deaths; Baguio and Cabanatuan heavily damaged.' },
  { name: 'Samar', year: 2012, m: 7.6, at: [10.81, 126.64], src: 'Philippine Trench',
    note: 'Offshore; triggered tsunami warnings across the Pacific.' },
  { name: 'Bohol', year: 2013, m: 7.2, at: [9.86, 124.07], src: 'North Bohol Fault',
    note: 'About 220 deaths; centuries-old churches collapsed.' },
  { name: 'Cotabato series', year: 2019, m: 6.6, at: [6.9, 125.05], src: 'Local faults',
    note: 'A series of M6+ quakes in October 2019 damaged thousands of homes.' },
  { name: 'Abra', year: 2022, m: 7.0, at: [17.53, 120.79], src: 'Abra River Fault',
    note: 'Felt across Luzon, including Metro Manila.' },
  { name: 'Hinatuan', year: 2023, m: 7.4, at: [8.53, 126.42], src: 'Philippine Trench',
    note: 'PHIVOLCS M7.4 (USGS M7.6). Coastal evacuations and tsunami warnings.' },
  { name: 'Cebu (Bogo)', year: 2025, m: 6.9, at: [11.13, 124.02], src: 'Offshore fault',
    note: 'Deadliest Philippine quake in over a decade.' },
  { name: 'Davao Oriental', year: 2025, m: 7.4, at: [7.24, 126.84], src: 'Philippine Trench',
    note: 'Offshore doublet (M7.4 followed by M6.8); tsunami warnings issued.' },
];

export const VOLCANOES = [
  { name: 'Pinatubo', at: [15.13, 120.35], note: '1991 eruption, 2nd largest of the 20th century' },
  { name: 'Taal', at: [14.0, 120.99], note: 'Erupted 2020; lake volcano near Metro Manila' },
  { name: 'Mayon', at: [13.26, 123.69], note: 'Most active PH volcano; near-perfect cone' },
  { name: 'Bulusan', at: [12.77, 124.05], note: 'Frequent steam and ash explosions' },
  { name: 'Kanlaon', at: [10.41, 123.13], note: 'Erupted 2024; fed by the Negros Trench' },
  { name: 'Hibok-Hibok', at: [9.2, 124.67], note: 'Camiguin island; deadly 1951 eruption' },
];

// Typical effects near the epicenter. Real shaking also depends on depth and distance.
export const MAG_LEVELS = [
  { m: 4, name: 'Light', effect: 'Felt by most people nearby. Windows rattle and hanging '
    + 'objects swing. Rarely any damage.', example: 'Happens several times a month in the PH' },
  { m: 5, name: 'Moderate', effect: 'Things fall off shelves and windows can break. Weak '
    + 'buildings may crack.', example: 'Many per year in the PH' },
  { m: 6, name: 'Strong', effect: 'Walls crack and poorly built houses are damaged within '
    + 'tens of kilometers.', example: '2019 Cotabato series (M6.6)' },
  { m: 7, name: 'Major', effect: 'Serious damage over a large area. Landslides and ground '
    + 'cracks. A tsunami is possible if it is offshore.', example: '2013 Bohol (M7.2)' },
  { m: 8, name: 'Great', effect: 'Buildings collapse across hundreds of kilometers. '
    + 'Offshore quakes can cause deadly tsunamis.', example: '1976 Moro Gulf (M8.0)' },
  { m: 9, name: 'Great (rare)', effect: 'Whole regions devastated; tsunamis cross entire '
    + 'oceans. Only possible on the biggest subduction zones.', example: '2011 Japan (M9.0)' },
];

// Steps of the 3D model animation. t = start time in seconds.
export const PHASES = [
  { t: 0, title: 'Plates converge',
    text: 'The Philippine Sea Plate (oceanic, heavy) moves west a few centimeters a year. At the '
      + 'Philippine Trench it bends and sinks beneath the lighter plate carrying the islands.' },
  { t: 5, title: 'Stress builds',
    text: 'Where the plates touch, friction locks them together. The sinking slab drags the edge '
      + 'of the upper plate down, bending it like a spring. This can last decades or centuries.' },
  { t: 11, title: 'Rupture: earthquake!',
    text: 'The stress overcomes friction. The locked zone slips in seconds and the bent edge '
      + 'snaps back up (elastic rebound). The energy radiates out as seismic waves.' },
  { t: 13.5, title: 'Tsunami',
    text: 'The seafloor jumps up, lifting the whole water column above it. That hump of water '
      + 'spreads out as a tsunami and grows taller as it reaches shallow coastal water.' },
  { t: 18, title: 'Magma and volcanoes',
    text: 'Deeper down (~100 km), the slab releases water into the hot mantle above it. Water '
      + 'lowers the melting point, magma forms, rises, and builds a chain of volcanoes.' },
];

export const QUIZ = [
  { q: 'Which plate sinks (subducts) at the Philippine Trench?',
    a: ['Philippine Sea Plate', 'Eurasian Plate', 'Indo-Australian Plate', 'North American Plate'],
    ok: 0 },
  { q: 'Why does the oceanic plate sink instead of the other plate?',
    a: ['It is warmer', 'It is denser (heavier) oceanic rock', 'It is thicker', 'It moves faster'],
    ok: 1 },
  { q: 'What mainly causes a tsunami during a subduction earthquake?',
    a: ['Strong winds', 'Volcanic ash', 'The seafloor suddenly lifting the water', 'The Moon'],
    ok: 2 },
  { q: 'Why does subduction create volcanoes?',
    a: ['The trench fills with lava', 'The slab melts at the surface',
      'Water from the slab melts the mantle above it', 'Earthquakes heat the rock'],
    ok: 2 },
  { q: 'What makes the Philippines extra susceptible to earthquakes?',
    a: ['It is squeezed between subduction zones facing opposite directions',
      'It is near the equator', 'It has many islands', 'It has a hot climate'],
    ok: 0 },
  { q: 'The ground starts shaking hard. What do you do first?',
    a: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in the doorway',
      'Take the elevator down'],
    ok: 1 },
];
