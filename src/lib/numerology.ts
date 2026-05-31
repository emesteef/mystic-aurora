interface NumerologyCalculationResult {
  originalNumber: number;
  reducedNumber: number;
  karmicNumber: number | null;
  masterNumber: number | null;
  spiritualGuidanceNumber: number | null;
}

const KARMIC_NUMBERS = [13, 14, 16, 19, 26, 29];
const MASTER_NUMBERS = [11, 22, 33];
const SPIRITUAL_GUIDANCE_NUMBERS = [17, 27];

function sumDigits(num: number): number {
  return num.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
}

function formatNumerologyCalculationResult(result: NumerologyCalculationResult): string {
  let specialValue = null;
  if (result.masterNumber && result.karmicNumber) {
    specialValue = `${result.karmicNumber} (master: ${result.masterNumber})`;
  } else {
    const special = result.masterNumber || result.karmicNumber;
    specialValue = special ? '' + special : null;
  }

  const reducedNumber = '' + result.reducedNumber;
  const displayFormatted = !!specialValue && specialValue !== reducedNumber;
  let formatted = displayFormatted ? `${specialValue} / ${reducedNumber}` : reducedNumber;
  if (result.spiritualGuidanceNumber) {
    formatted += ` - ochrona: ${result.spiritualGuidanceNumber}`;
  }
  return formatted;
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

  return { originalNumber: inputNumber, reducedNumber, karmicNumber, masterNumber, spiritualGuidanceNumber };
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

  // TODO: napisac samemu
  let karmicNumber = results.length === 1 ? results[0].karmicNumber : null;
  let masterNumber = results.length === 1 ? results[0].masterNumber : null;

  const bestResult = results.reduce((best, current) => {
    const bestHasSpecial = best.masterNumber || best.karmicNumber;
    const currentHasSpecial = current.masterNumber || current.karmicNumber;

    if (current.karmicNumber) karmicNumber = current.karmicNumber;
    if (current.masterNumber) masterNumber = current.masterNumber;

    if (currentHasSpecial && !bestHasSpecial) return current;
    if (current.masterNumber && !best.masterNumber) return current;
    if (current.karmicNumber && !best.karmicNumber) return current;

    return best;
  });

  return { ...bestResult, karmicNumber, masterNumber };
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
