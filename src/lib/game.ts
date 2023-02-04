const words: string[] = [];
const MAX_CHALLENGES = 6;

export const getInitialBoard = (): string[][] => {
  const board: string[][] = [];
  for (let i = 0; i < 6; i++) {
    board.push(new Array(5).fill(''));
  }

  return board;
};

export const getCapitalizedLetter = (letter: string) => {
  if (letter === 'ı') {
    return 'Í';
  }

  return letter.toUpperCase();
};

export const getRandomWord = (): string => {
  const len = words.length;
  const randomIndex = Math.floor(Math.random() * 100000) % len;
  return words[randomIndex].toUpperCase();
};

export const getWordleEmoji = (word: string, guessList: string[]): string => {
  const hasWon = guessList[guessList.length - 1] === word;

  let output = `Wordle ${hasWon ? guessList.length : 'x'}/${MAX_CHALLENGES}\n\n`;

  guessList.forEach(row => {
    let line = '';

    row.split('').forEach((char, colIndex) => {
      if (char === word[colIndex]) {
        line += '🟩';
      } else if (word.includes(char)) {
        line += '🟨';
      } else {
        line += '⬜️';
      }
    });

    output += line + '\n';
  });

  return output;
};
