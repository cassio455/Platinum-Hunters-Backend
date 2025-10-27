import { describe, expect, test } from 'vitest';
import { Game, GameProps } from '../../src/models/game';

describe('Game', () => {
  test('creating a game with wrong parameters', () => {
    const gameProps = <GameProps>{
      title: "Teest Game",
      backgroundImage: "",
      releaseDate: "2023-01-01",
    };
    expect(() => new Game(gameProps)).toThrowError("Invalid game properties");
  });
});
