// संपूर्ण महाराष्ट्रासाठी hub-to-hub route config (Kolhapur हे मुख्य दुकान/origin)
// नवीन शहर add करायचं असेल तर खाली एक नवीन ओळ टाका — किंवा जवळच्या शहरासारखाच route वापरा

const ROUTES = {
  // ---- स्थानिक (Kolhapur जवळपास) ----
  kolhapur: ['Kolhapur'],
  ichalkaranji: ['Kolhapur', 'Ichalkaranji'],
  gadhinglaj: ['Kolhapur', 'Gadhinglaj'],

  // ---- दक्षिण महाराष्ट्र (Sangli - Solapur पट्टा) ----
  sangli: ['Kolhapur', 'Sangli'],
  miraj: ['Kolhapur', 'Sangli', 'Miraj'],
  solapur: ['Kolhapur', 'Sangli', 'Solapur'],
  pandharpur: ['Kolhapur', 'Sangli', 'Solapur', 'Pandharpur'],
  osmanabad: ['Kolhapur', 'Sangli', 'Solapur', 'Osmanabad'],
  dharashiv: ['Kolhapur', 'Sangli', 'Solapur', 'Osmanabad'],
  latur: ['Kolhapur', 'Sangli', 'Solapur', 'Osmanabad', 'Latur'],

  // ---- पश्चिम महाराष्ट्र (Satara - Pune पट्टा) ----
  satara: ['Kolhapur', 'Satara'],
  karad: ['Kolhapur', 'Satara', 'Karad'],
  pune: ['Kolhapur', 'Satara', 'Pune'],
  pimpri: ['Kolhapur', 'Satara', 'Pune', 'Pimpri-Chinchwad'],
  ahmednagar: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar'],
  nagar: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar'],

  // ---- कोकण (Ratnagiri - Sindhudurg - Raigad पट्टा) ----
  ratnagiri: ['Kolhapur', 'Ratnagiri'],
  sindhudurg: ['Kolhapur', 'Ratnagiri', 'Sindhudurg'],
  kudal: ['Kolhapur', 'Ratnagiri', 'Sindhudurg', 'Kudal'],
  raigad: ['Kolhapur', 'Satara', 'Pune', 'Raigad'],
  alibaug: ['Kolhapur', 'Satara', 'Pune', 'Raigad', 'Alibaug'],

  // ---- मुंबई - ठाणे - पालघर पट्टा ----
  mumbai: ['Kolhapur', 'Satara', 'Pune', 'Mumbai'],
  thane: ['Kolhapur', 'Satara', 'Pune', 'Mumbai', 'Thane'],
  navimumbai: ['Kolhapur', 'Satara', 'Pune', 'Mumbai', 'Navi Mumbai'],
  palghar: ['Kolhapur', 'Satara', 'Pune', 'Mumbai', 'Thane', 'Palghar'],

  // ---- उत्तर महाराष्ट्र (Nashik - Dhule - Jalgaon पट्टा) ----
  nashik: ['Kolhapur', 'Satara', 'Pune', 'Nashik'],
  dhule: ['Kolhapur', 'Satara', 'Pune', 'Nashik', 'Dhule'],
  nandurbar: ['Kolhapur', 'Satara', 'Pune', 'Nashik', 'Dhule', 'Nandurbar'],
  jalgaon: ['Kolhapur', 'Satara', 'Pune', 'Nashik', 'Jalgaon'],

  // ---- मराठवाडा (Aurangabad/Chhatrapati Sambhajinagar - Jalna - Beed - Nanded पट्टा) ----
  aurangabad: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad'],
  chhatrapatisambhajinagar: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad'],
  jalna: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna'],
  beed: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Beed'],
  parbhani: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Parbhani'],
  hingoli: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Parbhani', 'Hingoli'],
  nanded: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Parbhani', 'Nanded'],

  // ---- विदर्भ (Amravati - Nagpur पट्टा) ----
  buldhana: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana'],
  akola: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola'],
  washim: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Washim'],
  amravati: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati'],
  yavatmal: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati', 'Yavatmal'],
  wardha: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati', 'Wardha'],
  nagpur: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati', 'Wardha', 'Nagpur'],
  bhandara: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati', 'Wardha', 'Nagpur', 'Bhandara'],
  gondia: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati', 'Wardha', 'Nagpur', 'Bhandara', 'Gondia'],
  chandrapur: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati', 'Wardha', 'Nagpur', 'Chandrapur'],
  gadchiroli: ['Kolhapur', 'Satara', 'Pune', 'Ahmednagar', 'Aurangabad', 'Jalna', 'Buldhana', 'Akola', 'Amravati', 'Wardha', 'Nagpur', 'Chandrapur', 'Gadchiroli'],
};

// Order च्या shipping city वरून योग्य route शोधतं
// List मध्ये city सापडली नाही तर थेट Kolhapur → ते शहर असा default route देतं
function getRouteForCity(city) {
  const key = (city || '').toLowerCase().trim().replace(/\s+/g, '');
  if (ROUTES[key]) {
    return ROUTES[key];
  }
  return ['Kolhapur', city || 'Unknown'];
}

module.exports = { ROUTES, getRouteForCity };