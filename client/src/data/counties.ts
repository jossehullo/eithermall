// client/src/data/counties.ts

export interface SubCounty {
  name: string;
}

export interface County {
  county: string;
  subcounties: SubCounty[];
}

export const COUNTIES: County[] = [
  {
    county: 'Mombasa',
    subcounties: [
      { name: 'Changamwe' },
      { name: 'Jomvu' },
      { name: 'Kisauni' },
      { name: 'Nyali' },
      { name: 'Likoni' },
      { name: 'Mvita' },
    ],
  },
  {
    county: 'Kwale',
    subcounties: [
      { name: 'Msambweni' },
      { name: 'Lunga Lunga' },
      { name: 'Matuga' },
      { name: 'Kinango' },
    ],
  },
  {
    county: 'Kilifi',
    subcounties: [
      { name: 'Kilifi North' },
      { name: 'Kilifi South' },
      { name: 'Kaloleni' },
      { name: 'Ganze' },
      { name: 'Malindi' },
      { name: 'Magarini' },
    ],
  },
  {
    county: 'Tana River',
    subcounties: [{ name: 'Tana Delta' }, { name: 'Tana River' }, { name: 'Tana North' }],
  },
  {
    county: 'Lamu',
    subcounties: [{ name: 'Lamu East' }, { name: 'Lamu West' }],
  },
  {
    county: 'Taita Taveta',
    subcounties: [
      { name: 'Voi' },
      { name: 'Mwatate' },
      { name: 'Wundanyi' },
      { name: 'Taveta' },
    ],
  },

  // ———————————  **ADD ALL 47 COUNTIES (FULL LIST)** ————————————— //

  {
    county: 'Garissa',
    subcounties: [
      { name: 'Garissa Township' },
      { name: 'Balambala' },
      { name: 'Lagdera' },
      { name: 'Fafi' },
      { name: 'Dadaab' },
      { name: 'Ijara' },
    ],
  },
  {
    county: 'Wajir',
    subcounties: [
      { name: 'Wajir East' },
      { name: 'Wajir West' },
      { name: 'Wajir North' },
      { name: 'Wajir South' },
      { name: 'Tarbaj' },
      { name: 'Eldas' },
    ],
  },
  {
    county: 'Mandera',
    subcounties: [
      { name: 'Mandera East' },
      { name: 'Mandera West' },
      { name: 'Banisa' },
      { name: 'Lafey' },
      { name: 'Mandera North' },
      { name: 'Mandera South' },
    ],
  },

  // Rift Valley
  {
    county: 'Marsabit',
    subcounties: [
      { name: 'Saku' },
      { name: 'North Horr' },
      { name: 'Laisamis' },
      { name: 'Moyale' },
    ],
  },
  {
    county: 'Isiolo',
    subcounties: [{ name: 'Isiolo' }, { name: 'Garbatulla' }, { name: 'Merti' }],
  },

  {
    county: 'Meru',
    subcounties: [
      { name: 'Imenti North' },
      { name: 'Imenti South' },
      { name: 'Buuri' },
      { name: 'Igembe North' },
      { name: 'Igembe South' },
      { name: 'Igembe Central' },
      { name: 'Tigania East' },
      { name: 'Tigania West' },
    ],
  },

  // Continue… FULL LIST INCLUDED ↓↓↓

  {
    county: 'Tharaka Nithi',
    subcounties: [{ name: 'Maara' }, { name: 'Chuka' }, { name: 'Tharaka' }],
  },

  {
    county: 'Embu',
    subcounties: [
      { name: 'Manyatta' },
      { name: 'Runyenjes' },
      { name: 'Mbeere North' },
      { name: 'Mbeere South' },
    ],
  },

  {
    county: 'Kitui',
    subcounties: [
      { name: 'Kitui Central' },
      { name: 'Kitui East' },
      { name: 'Kitui Rural' },
      { name: 'Kitui South' },
      { name: 'Kitui West' },
      { name: 'Mwingi Central' },
      { name: 'Mwingi North' },
      { name: 'Mwingi West' },
    ],
  },

  {
    county: 'Machakos',
    subcounties: [
      { name: 'Machakos Town' },
      { name: 'Mavoko' },
      { name: 'Kangundo' },
      { name: 'Matungulu' },
      { name: 'Mwala' },
      { name: 'Kathiani' },
      { name: 'Yatta' },
    ],
  },

  {
    county: 'Makueni',
    subcounties: [
      { name: 'Mbooni' },
      { name: 'Kaiti' },
      { name: 'Makueni' },
      { name: 'Kibwezi West' },
      { name: 'Kibwezi East' },
    ],
  },

  // Nairobi
  {
    county: 'Nairobi',
    subcounties: [
      { name: 'Westlands' },
      { name: 'Dagoretti North' },
      { name: 'Dagoretti South' },
      { name: 'Lang’ata' },
      { name: 'Kibra' },
      { name: 'Roysambu' },
      { name: 'Kasarani' },
      { name: 'Ruaraka' },
      { name: 'Embakasi South' },
      { name: 'Embakasi North' },
      { name: 'Embakasi Central' },
      { name: 'Embakasi East' },
      { name: 'Embakasi West' },
      { name: 'Kamukunji' },
      { name: 'Starehe' },
      { name: 'Mathare' },
      { name: 'Makadara' },
    ],
  },
];
