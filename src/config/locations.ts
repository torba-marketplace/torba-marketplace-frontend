import type { LocalizedText } from '@/lib/localized';
import { localized } from '@/lib/localized';

// Temporary FE mock (uk/en LocalizedText) for the header city picker.
// TODO: replace with GET /api/locations when the Python API is available.
// after agreeing with BE how translations work (?lang= vs bilingual payload).
export type CityLocation = {
  id: string;
  city: LocalizedText;
  region: LocalizedText;
};

export const defaultLocationId = 'kyiv';

const region = (uk: string, en: string): LocalizedText => ({ uk, en });

const vinnytsia = region('Вінницька область', 'Vinnytsia region');
const volyn = region('Волинська область', 'Volyn region');
const dnipropetrovsk = region('Дніпропетровська область', 'Dnipropetrovsk region');
const donetsk = region('Донецька область', 'Donetsk region');
const zhytomyrRegion = region('Житомирська область', 'Zhytomyr region');
const zakarpattia = region('Закарпатська область', 'Zakarpattia region');
const zaporizhzhiaRegion = region('Запорізька область', 'Zaporizhzhia region');
const ivanoFrankivskRegion = region('Івано-Франківська область', 'Ivano-Frankivsk region');
const kyivRegion = region('Київська область', 'Kyiv region');
const kirovohrad = region('Кіровоградська область', 'Kirovohrad region');
const crimea = region('АР Крим', 'Autonomous Republic of Crimea');
const luhanskRegion = region('Луганська область', 'Luhansk region');
const lvivRegion = region('Львівська область', 'Lviv region');
const mykolaivRegion = region('Миколаївська область', 'Mykolaiv region');
const odesaRegion = region('Одеська область', 'Odesa region');
const poltavaRegion = region('Полтавська область', 'Poltava region');
const rivneRegion = region('Рівненська область', 'Rivne region');
const sumyRegion = region('Сумська область', 'Sumy region');
const ternopilRegion = region('Тернопільська область', 'Ternopil region');
const kharkivRegion = region('Харківська область', 'Kharkiv region');
const khersonRegion = region('Херсонська область', 'Kherson region');
const khmelnytskyiRegion = region('Хмельницька область', 'Khmelnytskyi region');
const cherkasyRegion = region('Черкаська область', 'Cherkasy region');
const chernivtsiRegion = region('Чернівецька область', 'Chernivtsi region');
const chernihivRegion = region('Чернігівська область', 'Chernihiv region');
const sevastopolRegion = region('м. Севастополь', 'Sevastopol');

export const locations: CityLocation[] = [
  { id: 'kyiv', city: { uk: 'Київ', en: 'Kyiv' }, region: kyivRegion },
  { id: 'kharkiv', city: { uk: 'Харків', en: 'Kharkiv' }, region: kharkivRegion },
  { id: 'odesa', city: { uk: 'Одеса', en: 'Odesa' }, region: odesaRegion },
  { id: 'dnipro', city: { uk: 'Дніпро', en: 'Dnipro' }, region: dnipropetrovsk },
  { id: 'donetsk', city: { uk: 'Донецьк', en: 'Donetsk' }, region: donetsk },
  { id: 'zaporizhzhia', city: { uk: 'Запоріжжя', en: 'Zaporizhzhia' }, region: zaporizhzhiaRegion },
  { id: 'lviv', city: { uk: 'Львів', en: 'Lviv' }, region: lvivRegion },
  { id: 'kryvyi-rih', city: { uk: 'Кривий Ріг', en: 'Kryvyi Rih' }, region: dnipropetrovsk },
  { id: 'mykolaiv', city: { uk: 'Миколаїв', en: 'Mykolaiv' }, region: mykolaivRegion },
  { id: 'mariupol', city: { uk: 'Маріуполь', en: 'Mariupol' }, region: donetsk },
  { id: 'luhansk', city: { uk: 'Луганськ', en: 'Luhansk' }, region: luhanskRegion },
  { id: 'vinnytsia', city: { uk: 'Вінниця', en: 'Vinnytsia' }, region: vinnytsia },
  { id: 'simferopol', city: { uk: 'Сімферополь', en: 'Simferopol' }, region: crimea },
  { id: 'sevastopol', city: { uk: 'Севастополь', en: 'Sevastopol' }, region: sevastopolRegion },
  { id: 'kherson', city: { uk: 'Херсон', en: 'Kherson' }, region: khersonRegion },
  { id: 'poltava', city: { uk: 'Полтава', en: 'Poltava' }, region: poltavaRegion },
  { id: 'chernihiv', city: { uk: 'Чернігів', en: 'Chernihiv' }, region: chernihivRegion },
  { id: 'cherkasy', city: { uk: 'Черкаси', en: 'Cherkasy' }, region: cherkasyRegion },
  { id: 'sumy', city: { uk: 'Суми', en: 'Sumy' }, region: sumyRegion },
  {
    id: 'khmelnytskyi',
    city: { uk: 'Хмельницький', en: 'Khmelnytskyi' },
    region: khmelnytskyiRegion,
  },
  { id: 'chernivtsi', city: { uk: 'Чернівці', en: 'Chernivtsi' }, region: chernivtsiRegion },
  { id: 'zhytomyr', city: { uk: 'Житомир', en: 'Zhytomyr' }, region: zhytomyrRegion },
  { id: 'rivne', city: { uk: 'Рівне', en: 'Rivne' }, region: rivneRegion },
  {
    id: 'ivano-frankivsk',
    city: { uk: 'Івано-Франківськ', en: 'Ivano-Frankivsk' },
    region: ivanoFrankivskRegion,
  },
  { id: 'kamianske', city: { uk: 'Камʼянське', en: 'Kamianske' }, region: dnipropetrovsk },
  { id: 'kropyvnytskyi', city: { uk: 'Кропивницький', en: 'Kropyvnytskyi' }, region: kirovohrad },
  { id: 'kremenchuk', city: { uk: 'Кременчук', en: 'Kremenchuk' }, region: poltavaRegion },
  { id: 'ternopil', city: { uk: 'Тернопіль', en: 'Ternopil' }, region: ternopilRegion },
  { id: 'lutsk', city: { uk: 'Луцьк', en: 'Lutsk' }, region: volyn },
  { id: 'bila-tserkva', city: { uk: 'Біла Церква', en: 'Bila Tserkva' }, region: kyivRegion },
  { id: 'kramatorsk', city: { uk: 'Краматорськ', en: 'Kramatorsk' }, region: donetsk },
  { id: 'melitopol', city: { uk: 'Мелітополь', en: 'Melitopol' }, region: zaporizhzhiaRegion },
  { id: 'nikopol', city: { uk: 'Нікополь', en: 'Nikopol' }, region: dnipropetrovsk },
  { id: 'uzhhorod', city: { uk: 'Ужгород', en: 'Uzhhorod' }, region: zakarpattia },
  { id: 'brovary', city: { uk: 'Бровари', en: 'Brovary' }, region: kyivRegion },
  { id: 'pavlohrad', city: { uk: 'Павлоград', en: 'Pavlohrad' }, region: dnipropetrovsk },
  {
    id: 'sievierodonetsk',
    city: { uk: 'Сєвєродонецьк', en: 'Sievierodonetsk' },
    region: luhanskRegion,
  },
  { id: 'boyarka', city: { uk: 'Боярка', en: 'Boyarka' }, region: kyivRegion },
  { id: 'irpin', city: { uk: 'Ірпінь', en: 'Irpin' }, region: kyivRegion },
  { id: 'bucha', city: { uk: 'Буча', en: 'Bucha' }, region: kyivRegion },
  { id: 'boryspil', city: { uk: 'Бориспіль', en: 'Boryspil' }, region: kyivRegion },
  { id: 'mukachevo', city: { uk: 'Мукачево', en: 'Mukachevo' }, region: zakarpattia },
  { id: 'drohobych', city: { uk: 'Дрогобич', en: 'Drohobych' }, region: lvivRegion },
  { id: 'kolomyia', city: { uk: 'Коломия', en: 'Kolomyia' }, region: ivanoFrankivskRegion },
  { id: 'uman', city: { uk: 'Умань', en: 'Uman' }, region: cherkasyRegion },
  { id: 'berdiansk', city: { uk: 'Бердянськ', en: 'Berdiansk' }, region: zaporizhzhiaRegion },
  { id: 'sloviansk', city: { uk: 'Словʼянськ', en: 'Sloviansk' }, region: donetsk },
  { id: 'konotop', city: { uk: 'Конотоп', en: 'Konotop' }, region: sumyRegion },
  {
    id: 'kamianets-podilskyi',
    city: { uk: 'Камʼянець-Подільський', en: 'Kamianets-Podilskyi' },
    region: khmelnytskyiRegion,
  },
];

const popularLocationIds = ['kryvyi-rih', 'mykolaiv', 'boyarka', 'zhytomyr', 'ivano-frankivsk'];

export const popularLocations: CityLocation[] = popularLocationIds.map((id) => {
  const location = locations.find((item) => item.id === id);
  if (!location) {
    throw new Error(`Popular location is missing: ${id}`);
  }
  return location;
});

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’ʼ`]/g, '');
}

export function filterLocations(
  source: CityLocation[],
  query: string,
  locale: string,
): CityLocation[] {
  const needle = normalizeSearch(query);
  if (!needle) {
    return source;
  }

  return source.filter((location) => {
    const city = normalizeSearch(localized(location.city, locale));
    const regionName = normalizeSearch(localized(location.region, locale));
    return city.includes(needle) || regionName.includes(needle);
  });
}

export function searchLocations(query: string, locale: string): CityLocation[] {
  if (!query.trim()) {
    return popularLocations;
  }

  return filterLocations(locations, query, locale);
}

export function findLocation(id: string): CityLocation {
  const match = locations.find((location) => location.id === id);
  if (match) {
    return match;
  }

  const fallback = locations.find((location) => location.id === defaultLocationId);
  if (!fallback) {
    throw new Error('Default location is missing');
  }

  return fallback;
}
