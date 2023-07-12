export function formatString(aug: string, sliceAmount: number): string {
  let formattedString = aug.slice(sliceAmount).replace(/_/g, " ");

  const romanNumeralRegex = /\b(IV|V?I{0,3})\b$/g;
  const lastWord = formattedString.match(romanNumeralRegex);

  if (lastWord) {
    const lastWordFormatted = lastWord[0].replace(" ", "");
    formattedString = formattedString.replace(
      romanNumeralRegex,
      ` ${lastWordFormatted}`
    );
  }

  formattedString = formattedString.replace(/([IVX]+)$/, " $1");

  // Separate "I" when it is not part of a roman numeral
  formattedString = formattedString.replace(
    /([A-Z])(?!\b(IV|V?I{0,3})\b)/g,
    " $1"
  );

  formattedString = formattedString.replace(/(\d+)/g, " $1");

  // Cut the formatted string to a maximum length of 22 characters
  if (formattedString.length > 22) {
    formattedString = formattedString.slice(0, 22);
  }

  return formattedString.trim();
}

export const getMaximumCardCount = (cost: number) => {
  switch (cost) {
    case 1:
      return 29;
    case 2:
      return 22;
    case 3:
      return 18;
    case 4:
      return 12;
    case 5:
      return 10;
    default:
      return 0;
  }
};

export const getWinRateColor = (winRate: number) => {
  const percentage = winRate * 100;

  if (winRate == undefined) {
    return "text-black";
  } else if (percentage < 50) {
    return "text-red-600";
  } else if (percentage >= 50 && percentage < 60) {
    return "text-orange-600";
  } else if (percentage >= 60 && percentage < 70) {
    return "text-green-500";
  } else if (percentage >= 70 && percentage < 80) {
    return "text-blue-500";
  } else if (percentage >= 80 && percentage < 90) {
    return "text-purple-500";
  } else {
    return "text-pink-500";
  }
};
