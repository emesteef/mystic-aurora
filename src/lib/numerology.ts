interface NumerologyCalculationResult {
  originalNumber: number;
  reducedNumber: number;
  karmicNumber: number | null;
  masterNumber: number | null;
  spiritualGuidanceNumber: number | null;
  // wszystkie liczby karmiczne, mistrzowskie i ochronne, które pojawiły się w obliczeniach pola
  specialNumbers: number[];
}

const KARMIC_NUMBERS = [13, 14, 16, 19, 26, 29];
const MASTER_NUMBERS = [11, 22, 33, 44, 55, 66, 77, 88, 99];
const SPIRITUAL_GUIDANCE_NUMBERS = [12, 17, 23, 27, 28, 41];

function sumDigits(num: number): number {
  return num.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
}

function specialLabel(num: number): string {
  if (KARMIC_NUMBERS.includes(num)) return 'karma';
  if (MASTER_NUMBERS.includes(num)) return 'master';
  return 'ochrona';
}

function isSpecial(num: number): boolean {
  return KARMIC_NUMBERS.includes(num) || MASTER_NUMBERS.includes(num) || SPIRITUAL_GUIDANCE_NUMBERS.includes(num);
}

// Np. "3", "12 / 3 - ochrona", "29 / 11 - karma 29, master 11"
function formatNumerologyCalculationResult(result: NumerologyCalculationResult): string {
  const specials = result.specialNumbers;
  if (specials.length === 0) return '' + result.reducedNumber;

  const values = specials.includes(result.reducedNumber) ? specials : [...specials, result.reducedNumber];
  const labels = specials.length === 1
    ? specialLabel(specials[0])
    : specials.map((num) => `${specialLabel(num)} ${num}`).join(', ');
  return `${values.join(' / ')} - ${labels}`;
}

function reduceNumber(inputNumber: number): number[] {
  const reducedValues: number[] = [inputNumber];
  let reducedValue = inputNumber;
  while (reducedValue > 9) {
    reducedValue = sumDigits(reducedValue);
    reducedValues.push(reducedValue);
  }
  return reducedValues;
}

function sumNumbersThenReduce(inputNumber: number): NumerologyCalculationResult {
  let reducedNumber = inputNumber;
  let karmicNumber: number | null = null;
  let masterNumber: number | null = null;
  let spiritualGuidanceNumber: number | null = null;

  if (KARMIC_NUMBERS.includes(reducedNumber)) karmicNumber = reducedNumber;
  if (MASTER_NUMBERS.includes(reducedNumber)) masterNumber = reducedNumber;
  if (SPIRITUAL_GUIDANCE_NUMBERS.includes(reducedNumber)) spiritualGuidanceNumber = reducedNumber;

  while (reducedNumber > 9 && !MASTER_NUMBERS.includes(reducedNumber)) {
    reducedNumber = sumDigits(reducedNumber);
    if (KARMIC_NUMBERS.includes(reducedNumber)) karmicNumber = reducedNumber;
    if (MASTER_NUMBERS.includes(reducedNumber)) masterNumber = reducedNumber;
    if (SPIRITUAL_GUIDANCE_NUMBERS.includes(reducedNumber)) spiritualGuidanceNumber = reducedNumber;
  }

  return { originalNumber: inputNumber, reducedNumber, karmicNumber, masterNumber, spiritualGuidanceNumber, specialNumbers: [] };
}

function customCalculate(number1: number, number2?: number): NumerologyCalculationResult {
  const number1Values = reduceNumber(number1);
  let number2Values: number[] | undefined;
  if (number2) {
    number2Values = reduceNumber(number2);
  }

  const valuesSet = new Set<number>();
  for (const num1 of number1Values) {
    if (number2Values) {
      for (const num2 of number2Values) {
        valuesSet.add(num1 + num2);
      }
    } else {
      valuesSet.add(num1);
    }
  }

  const results: NumerologyCalculationResult[] = [];
  for (const value of valuesSet) {
    results.push(sumNumbersThenReduce(value));
  }

  const specialNumbers = new Set<number>();
  for (const value of valuesSet) {
    for (const num of reduceNumber(value)) {
      if (isSpecial(num)) specialNumbers.add(num);
    }
  }

  const bestResult = results.reduce((best, current) => {
    const bestHasSpecial = best.masterNumber || best.karmicNumber;
    const currentHasSpecial = current.masterNumber || current.karmicNumber;

    if (currentHasSpecial && !bestHasSpecial) return current;
    if (current.masterNumber && !best.masterNumber) return current;
    if (current.karmicNumber && !best.karmicNumber) return current;

    return best;
  });

  return { ...bestResult, specialNumbers: [...specialNumbers].sort((a, b) => b - a) };
}

export function calculateNumerology(date: Date): string[] {
  const birthDay = date.getDate();
  const birthMonth = date.getMonth() + 1;
  const dateFullYear = date.getFullYear();
  const birthYear = sumDigits(dateFullYear);

  const aResult = customCalculate(birthDay);
  const bResult = customCalculate(birthMonth);
  const cResult = customCalculate(birthYear);
  const dResult = customCalculate(aResult.originalNumber, bResult.originalNumber);
  const eResult = cResult;
  const fResult = customCalculate(dResult.originalNumber, eResult.originalNumber);
  const gResult = customCalculate(eResult.originalNumber, fResult.originalNumber);
  const hResult = customCalculate(dResult.originalNumber, fResult.originalNumber);
  const iResult = customCalculate(bResult.originalNumber, cResult.originalNumber);
  const jResult = customCalculate(aResult.originalNumber, dResult.originalNumber);
  const kResult = customCalculate(bResult.originalNumber, dResult.originalNumber);
  const lResult = customCalculate(bResult.originalNumber, eResult.originalNumber);
  const mResult = customCalculate(cResult.originalNumber, eResult.originalNumber);
  const nResult = customCalculate(kResult.originalNumber, lResult.originalNumber);

  return [
    formatNumerologyCalculationResult(aResult),
    formatNumerologyCalculationResult(bResult),
    formatNumerologyCalculationResult(cResult),
    formatNumerologyCalculationResult(dResult),
    formatNumerologyCalculationResult(eResult),
    formatNumerologyCalculationResult(fResult),
    formatNumerologyCalculationResult(gResult),
    formatNumerologyCalculationResult(hResult),
    formatNumerologyCalculationResult(iResult),
    formatNumerologyCalculationResult(jResult),
    formatNumerologyCalculationResult(kResult),
    formatNumerologyCalculationResult(lResult),
    formatNumerologyCalculationResult(mResult),
    formatNumerologyCalculationResult(nResult),
  ];
}
