import shortid from "shortid";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import { GameColor } from "../types/game";
import { makeGame } from "./chess";
import { ClockSettings } from "../components/clock-settings";

export const pickRandom = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const createGame = async (
  userName: string,
  userColor: GameColor,
  clockSettings: ClockSettings
): Promise<string> => {
  const id = shortid();

  await FirebaseDatabase.ref("game")
    .child(id)
    .set(
      makeGame({
        userId: FirebaseAuth.currentUser?.uid!,
        userColor,
        userName,
        clockSettings,
      })
    );

  return id;
};
