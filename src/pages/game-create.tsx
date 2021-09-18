import React from "react";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import shortid from "shortid";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Select, Typography } from "antd";
import { GameStatus } from "../types/game";

export const START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const GameCreate: React.FC = () => {
  const history = useHistory();

  const handleCreateGame = async (name: string, color: "w" | "b" | "r") => {
    const id = shortid();

    const side = color === "r" ? pickRandom(["w", "b"]) : color;

    await FirebaseDatabase.ref("game")
      .child(id)
      .set({
        [side]: {
          id: FirebaseAuth.currentUser?.uid,
          name,
          online: false,
        },
        fen: START_FEN,
        status: GameStatus.IN_PROGRESS,
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
        initialValues={{ color: "r" }}
        onFinish={({ name, color }: any) => handleCreateGame(name, color)}
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
