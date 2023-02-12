import Words from '../constants/Words';
import { MAX_CHALLENGES } from '../constants/Game';

export const getInitialBoard = () => {
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

export const upperCase = (word: string) => {
  let output = '';

  word.split('').forEach(letter => {
    output += getCapitalizedLetter(letter);
  });

  return output;
};

export const getRandomWord = () => {
  const len = Words.length;
  const randomIndex = Math.floor(Math.random() * 100000) % len;

  return upperCase(Words[randomIndex]);
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

export const getWordOfTheDay = () => {
  const now = new Date();
  const start = new Date(2023, 0, 0);
  const diff = now.valueOf() - start.valueOf();

  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > Words.length) {
    day -= Words.length;
  }

  return Words[day];
};

export const WORD_OF_THE_DAY = upperCase(getWordOfTheDay());
