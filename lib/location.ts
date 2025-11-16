export interface Coordinates {
  lat: number
  lng: number
}

const cityCoordinatesMap: Record<string, Coordinates> = {
  "istanbul": { lat: 41.015137, lng: 28.97953 },
  "ankara": { lat: 39.925533, lng: 32.866287 },
  "izmir": { lat: 38.423733, lng: 27.142826 },
  "bursa": { lat: 40.195, lng: 29.060 },
  "antalya": { lat: 36.896893, lng: 30.713324 },
  "adana": { lat: 37.0, lng: 35.321333 },
  "konya": { lat: 37.871666, lng: 32.484722 },
  "gaziantep": { lat: 37.06622, lng: 37.38332 },
  "sanliurfa": { lat: 37.167, lng: 38.793 },
  "şanlıurfa": { lat: 37.167, lng: 38.793 },
  "mersin": { lat: 36.8121, lng: 34.6415 },
  "diyarbakir": { lat: 37.91441, lng: 40.23063 },
  "kayseri": { lat: 38.733333, lng: 35.483333 },
  "eskisehir": { lat: 39.766705, lng: 30.526971 },
  "eskişehir": { lat: 39.766705, lng: 30.526971 },
  "trabzon": { lat: 41.0027, lng: 39.7168 },
  "samsun": { lat: 41.2867, lng: 36.33 },
  "denizli": { lat: 37.77652, lng: 29.08639 },
  "sakarya": { lat: 40.7569, lng: 30.3783 },
  "tekirdag": { lat: 40.978, lng: 27.515 },
  "tekirdağ": { lat: 40.978, lng: 27.515 },
  "balikesir": { lat: 39.6484, lng: 27.8826 },
  "balıkesir": { lat: 39.6484, lng: 27.8826 },
  "kutahya": { lat: 39.4167, lng: 29.9833 },
  "kütahya": { lat: 39.4167, lng: 29.9833 },
  "manisa": { lat: 38.6191, lng: 27.4289 },
  "aydin": { lat: 37.845, lng: 27.8396 },
  "aydın": { lat: 37.845, lng: 27.8396 },
  "malatya": { lat: 38.3554, lng: 38.3334 },
  "van": { lat: 38.4945, lng: 43.3816 },
  "hatay": { lat: 36.2021, lng: 36.1603 },
  "ordu": { lat: 40.9843, lng: 37.8784 },
  "zonguldak": { lat: 41.4564, lng: 31.7987 },
  "rize": { lat: 41.0201, lng: 40.5234 },
  "edirne": { lat: 41.6771, lng: 26.5557 },
  "yalova": { lat: 40.655, lng: 29.2769 },
  "kocaeli": { lat: 40.8533, lng: 29.8815 },
  "çanakkale": { lat: 40.1553, lng: 26.4142 },
  "canakkale": { lat: 40.1553, lng: 26.4142 },
  "giresun": { lat: 40.9175, lng: 38.391 },
  "sivas": { lat: 39.7477, lng: 37.0179 },
  "nevsehir": { lat: 38.6247, lng: 34.7146 },
  "nevşehir": { lat: 38.6247, lng: 34.7146 },
  "mardin": { lat: 37.3129, lng: 40.7339 },
  "kars": { lat: 40.6013, lng: 43.0955 },
}

export function getCityCoordinates(city: string | null | undefined): Coordinates | null {
  if (!city) return null

  const normalized = city
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\u0307/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[\u0300-\u036f]/g, "")

  return cityCoordinatesMap[normalized] || null
}
