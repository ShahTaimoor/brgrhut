export const COMPANY_INFO = {
  name: 'brgrhut',
  tagline: 'FLAME GRILLED BURGERS',
  description: 'Savor the smoky, flame-grilled goodness of our handcrafted burgers, crispy golden fries, and gourmet pizzas made with fresh ingredients daily.',
}

export const CONTACT_INFO = {
  // Placeholder UK number (01922 is Walsall's area code, covering Darlaston) -
  // swap for the real business line whenever that's set up.
  phone: '+44 1922 400096',
}

const ADDRESS_LINES = [
  'Unit 51a, Darlaston Central Trading Estate,',
  'Salisbury Street, Darlaston,',
  'West Midlands, WS10 8XB',
]

export const LOCATION = {
  address: ADDRESS_LINES,
  // Built from the same address lines shown above (rather than a hand-picked
  // lat/long) so the map pin can't drift out of sync with the printed
  // address - Google geocodes the query string itself when the embed loads.
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_LINES.join(' '))}&output=embed`,
}

export const SOCIAL_MEDIA = [
  {
    name: 'Facebook',
    icon: 'facebook',
    color: 'hover:text-blue-400',
    href: '#',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    color: 'hover:text-pink-400',
    href: '#',
  },
]

export const COPYRIGHT_TEXT = 'All rights reserved.'

export const SECTION_TITLES = {
  contactInfo: 'Contact Info',
  location: 'Location',
}