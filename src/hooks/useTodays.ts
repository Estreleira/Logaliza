import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import { Country } from "../domain/countries";
import { countriesI, CountryCode } from "../domain/countries.position";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";
import { areas, bigEnoughCountriesWithImage, countriesWithImage, smallCountryLimit } from './../environment';

const forcedCountries: Record<string, CountryCode> = {
  "2023-01-12": "CAR",
  "2023-01-13": "MAS",
  "2023-01-14": "TRA",
  "2023-01-15": "TNA",
  "2023-01-16": "SAL",
  "2023-01-17": "VIG",
  "2023-01-18": "BAR",
  "2023-01-19": "CND",
  "2023-01-20": "BER",
  "2023-01-21": "VIA",
  "2023-01-22": "MON",
  "2023-01-23": "COM",
  "2023-01-24": "BEZ",
  "2023-01-25": "DEC",
  "2023-01-26": "BUR",
  "2023-01-27": "SEA",
  "2023-01-28": "TAV",
  "2023-01-29": "TCA",
  "2023-01-30": "ORT",
  "2023-01-31": "COS",
  
  "2023-02-01": "CHA",
  "2023-02-02": "LIM",
  "2023-02-03": "MAR",
  "2023-02-04": "TMO",
  "2023-02-05": "CAB",
  "2023-02-06": "RIB",
  "2023-02-07": "COR",
  "2023-02-08": "TCH",
  "2023-02-09": "BAM",
  "2023-02-10": "MUR",
  "2023-02-11": "LUG",
  "2023-02-12": "CEL",
  "2023-02-13": "BAL",
  "2023-02-14": "TTR",
  "2023-02-15": "PAR",
  "2023-02-16": "ANC",
  "2023-02-17": "OUR",
  "2023-02-18": "EUM",
  "2023-02-19": "ORD",
  "2023-02-20": "TLE",
  "2023-02-21": "TME",
  "2023-02-22": "CAL",
  "2023-02-23": "VDO",
  "2023-02-24": "MOR",
  "2023-02-25": "PON",
  "2023-02-26": "ARC",
  "2023-02-27": "SAR",
  "2023-02-28": "COU",
  "2023-03-01": "ULH",
  "2023-03-02": "VDI",
  "2023-03-03": "ARN",
  
  "2023-03-04": "VIG",
  "2023-03-05": "DEC",
  "2023-03-06": "ANC",
  "2023-03-07": "MUR",
  "2023-03-08": "CND",
  "2023-03-09": "ORT",
  "2023-03-10": "TNA",

  "2023-03-11": "LIM",
  "2023-03-12": "MAR",
  "2023-03-13": "SEA",
  "2023-03-14": "COM",
  "2023-03-15": "BUR",
  "2023-03-16": "LUG",
  "2023-03-17": "CAB",

  "2023-03-18": "TCH",
  "2023-03-19": "BEZ",
  "2023-03-20": "MAS",
  "2023-03-21": "TRA",
  "2023-03-22": "TAV",
  "2023-03-23": "CAR",
  "2023-03-24": "CHA",
}

const randomNumber: Record<string, number> = {
  "2023-01-12": 5,
  "2023-01-13": 2,
  "2023-01-14": 6,
  "2023-01-15": 2,
  "2023-01-16": 3,
  "2023-01-17": 6,
  "2023-01-18": 2,
  "2023-01-19": 2,
  "2023-01-20": 1,
  "2023-01-21": 2,
  "2023-01-22": 2,
  "2023-01-23": 4,
  "2023-01-24": 5,
  "2023-01-25": 6,
  "2023-01-26": 1,
  "2023-01-27": 5,
  "2023-01-28": 3,
  "2023-01-29": 2,
  "2023-01-30": 4,
  "2023-01-31": 6,

  "2023-02-01": 1,
  "2023-02-02": 2,
  "2023-02-03": 4,
  "2023-02-04": 2,
  "2023-02-05": 3,
  "2023-02-06": 2,
  "2023-02-07": 1,
  "2023-02-08": 3,
  "2023-02-09": 3,
  "2023-02-10": 2,
  "2023-02-11": 6,
  "2023-02-12": 1,
  "2023-02-13": 5,
  "2023-02-14": 2,
  "2023-02-15": 2,
  "2023-02-16": 2,
  "2023-02-17": 6,
  "2023-02-18": 1,
  "2023-02-19": 6,
  "2023-02-20": 7,
  "2023-02-21": 1,
  "2023-02-22": 5,
  "2023-02-23": 6,
  "2023-02-24": 1,
  "2023-02-25": 3,
  "2023-02-26": 3,
  "2023-02-27": 5,
  "2023-02-28": 3,
  "2023-03-01": 3,
  "2023-03-02": 7,
  "2023-03-03": 6,

  "2023-03-04": 3,
  "2023-03-05": 2,
  "2023-03-06": 5,
  "2023-03-07": 4,
  "2023-03-08": 4,
  "2023-03-09": 5,
  "2023-03-10": 1,

  "2023-03-11": 3,
  "2023-03-12": 6,
  "2023-03-13": 2,
  "2023-03-14": 1,
  "2023-03-15": 4,
  "2023-03-16": 5,
  "2023-03-17": 2,

  "2023-03-18": 5,
  "2023-03-19": 6,
  "2023-03-20": 4,
  "2023-03-21": 3,
  "2023-03-22": 2,
  "2023-03-23": 1,
  "2023-03-24": 6,
}

const noRepeatStartDate = DateTime.fromFormat("2022-05-01", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
  {
    country?: Country;
    guesses: Guess[];
  },
  (guess: Guess) => void,
  number,
  number,
  number
] {
  const [todays, setTodays] = useState<{
    country?: Country;
    guesses: Guess[];
  }>({ guesses: [] });

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ country: prev.country, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const country = getCountry(dayString);

    setTodays({ country, guesses });
  }, [dayString]);

  const randomAngle = useMemo(
    () => seedrandom.alea(dayString)() * 360,
    [dayString]
  );

  const imageScale = useMemo(() => {
    const normalizedAngle = 45 - (randomAngle % 90);
    const radianAngle = (normalizedAngle * Math.PI) / 180;
    return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  }, [randomAngle]);

  const randomImageNumber = randomNumber[dayString];

  return [todays, addGuess, randomImageNumber, randomAngle, imageScale];
}

function getCountry(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  let smallCountryCooldown = 0;
  let pickedCountry: Country | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    smallCountryCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedCountryCode = forcedCountries[dayString];

    const forcedCountry =
      forcedCountryCode != null
        ? countriesWithImage.find(
          (country: countriesI) => country.code === forcedCountryCode
        )
        : undefined;

    const countrySelection =
      smallCountryCooldown < 0
        ? countriesWithImage
        : bigEnoughCountriesWithImage;

    if (forcedCountry != null) {
      pickedCountry = forcedCountry;
    } else {
      let countryIndex = Math.floor(
        seedrandom.alea(pickingDateString)() * countrySelection.length
      );
      pickedCountry = countrySelection[countryIndex];

      if (pickingDate >= noRepeatStartDate) {
        while (isARepeat(pickedCountry, lastPickDates, pickingDate)) {
          countryIndex = (countryIndex + 1) % countrySelection.length;
          pickedCountry = countrySelection[countryIndex];
        }
      }
    }

    if (areas[pickedCountry!.code] < smallCountryLimit) {
      smallCountryCooldown = 7;
    }


    lastPickDates[pickedCountry!.code] = pickingDate;
    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  return pickedCountry!;
}

function isARepeat(
  pickedCountry: Country | null,
  lastPickDates: Record<string, DateTime>,
  pickingDate: DateTime
) {
  if (pickedCountry == null || lastPickDates[pickedCountry.code] == null) {
    return false;
  }
  const daysSinceLastPick = pickingDate.diff(
    lastPickDates[pickedCountry.code],
    "day"
  ).days;

  return daysSinceLastPick < 100;
}
