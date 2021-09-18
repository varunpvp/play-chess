import React from "react";
import { FirebaseAuth } from "../config/firebase";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Radio, Select, Typography } from "antd";
import { GameStatus } from "../types/game";
import { createGame, newClock } from "../util/game";

export const START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const GameCreate: React.FC = () => {
  const history = useHistory();

  const handleCreateGame = async (
    name: string,
    color: "w" | "b" | "r",
    time: number,
    increment: number
  ) => {
    const side = color === "r" ? pickRandom(["w", "b"]) : color;

    const id = await createGame({
      [side]: {
        id: FirebaseAuth.currentUser?.uid,
        name,
        online: false,
      },
      fen: START_FEN,
      status: GameStatus.IN_PROGRESS,
      clock: newClock(time, increment),
    });

    history.push(`/${id}`);
  };

  return (
    <div className="container-sm mt-md">
      <Typography.Title className="text-center" level={3}>
        Play Chess
      </Typography.Title>

      <Typography.Title className="text-center" level={4}>
        Create a Game
      </Typography.Title>

      <Form
        requiredMark={false}
        layout="vertical"
        initialValues={{ color: "r", limit: "5", increment: "3" }}
        onFinish={({ name, color, limit, increment }) =>
          handleCreateGame(name, color, Number(limit), Number(increment))
        }
      >
        <Form.Item label="Name" name="name" required={true}>
          <Input placeholder="Your name" />
        </Form.Item>

        <Form.Item label="Color" name="color" required={true}>
          <Select>
            <Select.Option value="r">Random</Select.Option>
            <Select.Option value="w">White</Select.Option>
            <Select.Option value="b">Black</Select.Option>
          </Select>
        </Form.Item>

        <div style={{ display: "flex" }}>
          <Form.Item label="Time limit" name="limit" required={true}>
            <Radio.Group
              options={["3", "5", "10", "15"]}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>

          <div style={{ width: 24 }} />

          <Form.Item label="Increment" name="increment" required={true}>
            <Radio.Group
              options={["0", "3", "5", "10"]}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
        </div>

        <Button type="primary" block htmlType="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

function pickRandom<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export default GameCreate;
