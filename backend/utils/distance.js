// तुमच्या दुकानाचं खरं location
const SHOP_LOCATION = {
  latitude: 16.69641589335331,
  longitude: 74.24761239962677,
};

// दोन coordinates मधलं अंतर km मध्ये काढतं
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // पृथ्वीची त्रिज्या (km)

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// अंतरावरून expected delivery days ठरवतं
function estimateDeliveryDays(distanceKm) {
  if (distanceKm <= 5) return 1;
  if (distanceKm <= 15) return 2;
  if (distanceKm <= 40) return 3;
  if (distanceKm <= 100) return 5;
  return 7;
}

module.exports = { SHOP_LOCATION, getDistanceKm, estimateDeliveryDays };