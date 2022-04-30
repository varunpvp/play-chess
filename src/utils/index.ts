import shortid from "shortid";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import { GameColor } from "../types/game";
import { makeGame } from "./chess";

export const pickRandom = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const createGame = async (
  userName: string,
  userColor: GameColor
): Promise<string> => {
  const id = shortid();

  await FirebaseDatabase.ref("game")
    .child(id)
    .set(
      makeGame({
        userId: FirebaseAuth.currentUser?.uid!,
        userColor,
        userName,
      })
    );

  return id;
};
