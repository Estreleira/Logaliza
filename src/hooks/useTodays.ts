import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import { Country } from "../domain/countries";
import { CountryCode, countriesI } from "../domain/countries.position";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";
import { areas, bigEnoughCountriesWithImage, countriesWithImage, smallCountryLimit } from './../environment';

//CAR MOR SAL BER TME CAB VIA ORD PON BAR COS COR LUG ARC
const forcedCountriess: Record<string, number[]> = {
  "ANC": [2, 4, 5, 1],
  "ARC": [1, 3, 2],
  "ARN": [6, 7, 2],
  "BAL": [3, 5, 1],
  "BAM": [2, 3, 4],
  "BAR": [2, 5, 3],
  "BER": [1, 6, 3, 2],
  "BEZ": [5, 6, 2, 1],
  "BUR": [1, 4, 6, 3],
  "CAB": [2, 3, 5],
  "CAL": [2, 5, 6],
  "CAR": [1, 5, 2, 4],
  "CEL": [1, 3, 2],
  "CHA": [1, 6, 4, 2],
  "CND": [1, 2, 4, 3],
  "COM": [1, 4, 6, 2],
  "COR": [1, 4, 7],
  "COS": [6, 1, 4],
  "COU": [2, 3, 5],
  "DEC": [2, 6, 1],
  "EUM": [1, 3, 2],
  "LIM": [2, 3, 5, 1],
  "LUG": [5, 6, 1],
  "MAR": [4, 6, 2, 3],
  "MAS": [2, 4, 5, 6],
  "MON": [2, 4, 3],
  "MOR": [1, 6, 5, 4],
  "MUR": [2, 4, 1, 5],
  "ORD": [3, 6, 2],
  "ORT": [4, 5, 3, 1],
  "OUR": [1, 6, 5],
  "PAR": [1, 2, 6],
  "PON": [2, 3, 6],
  "RIB": [2, 5, 6],
  "SAL": [3, 4, 1, 5],
  "SAR": [4, 5, 3],
  "SEA": [2, 5, 3],
  "TAV": [2, 3, 5],
  "TCA": [2, 5, 4],
  "TCH": [3, 5, 2],
  "TLE": [2, 7, 4],
  "TME": [1, 3, 4],
  "TMO": [2, 6, 4],
  "TNA": [1, 2, 3, 5],
  "TRA": [3, 6, 1, 2],
  "TTR": [1, 2, 5],
  "ULH": [3, 5, 4, 2],
  "VDI": [3, 7, 1, 6],
  "VDO": [4, 6, 3],
  "VIA": [2, 4, 6],
  "VIG": [3, 5, 6, 4],
}

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



  "2023-03-25": "SAL",
  "2023-03-26": "BER",
  "2023-03-27": "BAM",
  "2023-03-28": "CEL",
  "2023-03-29": "COS",
  "2023-03-30": "ORD",
  "2023-03-31": "BAR",
  "2023-04-01": "VIA",

  "2023-04-02": "EUM",
  "2023-04-03": "ARC",
  "2023-04-04": "PON",
  "2023-04-05": "SAR",
  "2023-04-06": "TCA",
  "2023-04-07": "COR",
  "2023-04-08": "TME",
  "2023-04-09": "MOR",
  "2023-04-10": "TLE",
  "2023-04-11": "OUR",
  "2023-04-12": "BAL",
  "2023-04-13": "RIB",
  "2023-04-14": "COU",
  "2023-04-15": "MON",
  "2023-04-16": "TMO",
  "2023-04-17": "PAR",  
  "2023-04-18": "ARN",
  "2023-04-19": "CAL",
  "2023-04-20": "TTR",
  "2023-04-21": "ULH",
  "2023-04-22": "VDI",
  "2023-04-23": "VDO",

  "2023-04-24": "VIG",
  "2023-04-25": "TNA",

  "2023-04-26": "CND",
  "2023-04-27": "ANC",

  "2023-04-28": "MAR",
  "2023-04-29": "LIM",
  "2023-04-30": "ORT",
  "2023-05-01": "MUR",
  "2023-05-02": "BEZ",
  "2023-05-03": "COM",
  "2023-05-04": "CHA",
  "2023-05-05": "SEA",

  "2023-05-06": "BUR",
  "2023-05-07": "MAS",
  "2023-05-08": "TRA",
  "2023-05-09": "BAM",
  "2023-05-10": "TAV",
  "2023-05-11": "TCH",
  "2023-05-12": "DEC",

  "2023-05-13": "CAR",
  "2023-05-14": "MOR",
  "2023-05-15": "SAL",
  "2023-05-16": "BER",
  "2023-05-17": "TME",
  "2023-05-18": "CAB",
  "2023-05-19": "VIA",
  "2023-05-20": "ORD",
  "2023-05-21": "PON",
  "2023-05-22": "BAR",
  "2023-05-23": "COS",
  "2023-05-24": "COR",
  "2023-05-25": "LUG",
  "2023-05-26": "ARC",

  "2023-05-30": "EUM",
  "2023-05-31": "TCA",
  "2023-06-01": "SAR",
  "2023-06-02": "OUR",

  "2023-06-03": "ARN", 
  "2023-06-04": "BAL", 
  "2023-06-05": "RIB", 
  "2023-06-06": "ULH", 
  "2023-06-07": "MON", 
  "2023-06-08": "TTR", 
  "2023-06-09": "TLE", 

  "2023-06-10": "CAL", 
  "2023-06-11": "COU", 
  "2023-06-12": "CEL", 
  "2023-06-13": "VDI", 
  "2023-06-14": "VDO", 
  "2023-06-15": "TMO", 
  "2023-06-16": "PAR", 
  "2023-06-17": "DEC", 

//////////////

  "2023-06-18": "CHA",
  "2023-06-19": "CND",
  "2023-06-20": "ANC",
  "2023-06-21": "VDI",
  "2023-06-22": "SAL",
  "2023-06-23": "MOR",
  "2023-06-24": "BUR",
  "2023-06-25": "TNA",
  "2023-06-26": "ORT",
  "2023-06-27": "CAR",

  /////////////

  "2023-06-28": "BER",
  "2023-06-29": "MAS",
  "2023-06-30": "TRA",
  "2023-07-01": "BEZ",
  "2023-07-02": "MUR",
  "2023-07-03": "VIG",
  "2023-07-04": "LIM",
  "2023-07-05": "MAR",
  "2023-07-06": "COM",
  "2023-07-07": "ULH",
  "2023-07-08": "DEC",
  "2023-07-09": "TTR",
  "2023-07-10": "TAV",
  "2023-07-11": "SEA",
  "2023-07-12": "TCH",
  "2023-07-13": "CAL",
  "2023-07-14": "VDO",
  "2023-07-15": "BAM",
  "2023-07-16": "BEZ",
  "2023-07-17": "CAR",
  "2023-07-18": "CND",
  "2023-07-19": "COM",
  "2023-07-20": "CHA",
  "2023-07-21": "ORT",
  "2023-07-22": "TCH",
  "2023-07-23": "BER",
  "2023-07-24": "ULH",
  "2023-07-25": "MAS",
  "2023-07-26": "TRA",
  "2023-07-27": "TAV",
  "2023-07-28": "SAL",
  "2023-07-29": "MUR",
  "2023-07-30": "BAM",
  "2023-07-31": "BUR",
  "2023-08-01": "DEC",
  "2023-08-02": "VDI",
  "2023-08-03": "ANC",
  "2023-08-04": "SEA",
  "2023-08-05": "TTR",
  "2023-08-06": "CAL",
  "2023-08-07": "VIG",
  "2023-08-08": "LIM",
  "2023-08-09": "TNA",
  "2023-08-10": "VDO",
  "2023-08-11": "MAR",
  "2023-08-12": "MOR",

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

  "2023-03-25": 4,//SAL
  "2023-03-26": 6,//BER
  "2023-03-27": 2,//BAM
  "2023-03-28": 3,//CEL
  "2023-03-29": 1,//COS
  "2023-03-30": 3,//ORD
  "2023-03-31": 5,//BAR
  "2023-04-01": 4,//VIA

  "2023-04-02": 3,//EUM
  "2023-04-03": 1,//ARC
  "2023-04-04": 2,//PON
  "2023-04-05": 4,//SAR
  "2023-04-06": 5,//TCA
  "2023-04-07": 4,//COR
  "2023-04-08": 3,//TME
  "2023-04-09": 6,//MOR
  "2023-04-10": 2,//TLE
  "2023-04-11": 1,//OUR
  "2023-04-12": 3,//BAL
  "2023-04-13": 5,//RIB
  "2023-04-14": 2,//COU
  "2023-04-15": 4,//MON
  "2023-04-16": 6,//TMO
  "2023-04-17": 1,//PAR
  "2023-04-18": 7,//ARN
  "2023-04-19": 2,//CAL
  "2023-04-20": 1,//TTR
  "2023-04-21": 5,//ULH
  "2023-04-22": 3,//VDI
  "2023-04-23": 4,//VDO


  "2023-04-24": 5,//VIG
  "2023-04-25": 3,//TNA

  "2023-04-26": 1,//CND
  "2023-04-27": 4,//ANC

  "2023-04-28": 2,//MAR
  "2023-04-29": 5,//LIM
  "2023-04-30": 3,//ORT
  "2023-05-01": 1,//MUR
  "2023-05-02": 2,//BEZ
  "2023-05-03": 6,//COM
  "2023-05-04": 4,//CHA
  "2023-05-05": 3,//SEA

  "2023-05-06": 6,//BUR
  "2023-05-07": 5,//MAS
  "2023-05-08": 1,//TRA
  "2023-05-09": 4,//BAM
  "2023-05-10": 5,//TAV
  "2023-05-11": 2,//TCH
  "2023-05-12": 3,//DEC

  "2023-05-13": 2,//CAR
  "2023-05-14": 5,//MOR
  "2023-05-15": 1,//SAL
  "2023-05-16": 3,//BER
  "2023-05-17": 4,//TME
  "2023-05-18": 5,//CAB
  "2023-05-19": 6,//VIA
  "2023-05-20": 2,//ORD
  "2023-05-21": 6,//PON
  "2023-05-22": 3,//BAR
  "2023-05-23": 4,//COS
  "2023-05-24": 7,//COR
  "2023-05-25": 1,//LUG
  "2023-05-26": 2,//ARC
  
  "2023-05-30": 2,// EUM
  "2023-05-31": 4,// TCA
  "2023-06-01": 3,// SAR
  "2023-06-02": 5,// OUR


  "2023-06-03": 2,// ARN
  "2023-06-04": 1,// BAL
  "2023-06-05": 6,// RIB
  "2023-06-06": 4,// ULH
  "2023-06-07": 3,// MON
  "2023-06-08": 5,// TTR
  "2023-06-09": 4,// TLE

  "2023-06-10": 6,// CAL
  "2023-06-11": 5,// COU
  "2023-06-12": 2,// CEL
  "2023-06-13": 1,// VDI
  "2023-06-14": 3,// VDO
  "2023-06-15": 4,// TMO
  "2023-06-16": 6,// PAR
  "2023-06-17": 1,// DEC

  ////////////////////

  "2023-06-18": 2, //CHA,
  "2023-06-19": 3, //CND,
  "2023-06-20": 1, //ANC,
  "2023-06-21": 6, //VDI,
  "2023-06-22": 5, //SAL,
  "2023-06-23": 4, //MOR,
  "2023-06-24": 3, //BUR,
  "2023-06-25": 5, //TNA,
  "2023-06-26": 1, //ORT,
  "2023-06-27": 4, //CAR,

  "2023-06-28": 2, //BER,
  "2023-06-29": 6, //MAS,
  "2023-06-30": 2, //TRA,
  "2023-07-01": 1, //BEZ,
  "2023-07-02": 5, //MUR,
  "2023-07-03": 4, //VIG,
  "2023-07-04": 1, //LIM,
  "2023-07-05": 3, //MAR,
  "2023-07-06": 2, //COM,
  "2023-07-07": 2, //ULH,
  
  
  ///////////////////TODO
  "2023-07-08": 1, //DEC,
  "2023-07-09": 1, //TTR,
  "2023-07-10": 1, //TAV,
  "2023-07-11": 1, //SEA,
  "2023-07-12": 1, //TCH,
  "2023-07-13": 1, //CAL,
  "2023-07-14": 1, //VDO,
  "2023-07-15": 1, //BAM,
  "2023-07-16": 1, //BEZ,
  "2023-07-17": 1, //CAR,
  "2023-07-18": 1, //CND,
  "2023-07-19": 1, //COM,
  "2023-07-20": 1, //CHA,
  "2023-07-21": 1, //ORT,
  "2023-07-22": 1, //TCH,
  "2023-07-23": 1, //BER,
  "2023-07-24": 1, //ULH,
  "2023-07-25": 1, //MAS,
  "2023-07-26": 1, //TRA,
  "2023-07-27": 1, //TAV,
  "2023-07-28": 1, //SAL,
  "2023-07-29": 1, //MUR,
  "2023-07-30": 1, //BAM,
  "2023-07-31": 1, //BUR,
  "2023-08-01": 1, //DEC,
  "2023-08-02": 1, //VDI,
  "2023-08-03": 1, //ANC,
  "2023-08-04": 1, //SEA,
  "2023-08-05": 1, //TTR,
  "2023-08-06": 1, //CAL,
  "2023-08-07": 1, //VIG,
  "2023-08-08": 1, //LIM,
  "2023-08-09": 1, //TNA,
  "2023-08-10": 1, //VDO,
  "2023-08-11": 1, //MAR,
  "2023-08-12": 1, //MOR,

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
