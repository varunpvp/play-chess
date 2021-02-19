import React from "react";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import shortid from "shortid";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Select, Typography } from "antd";

export const START_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const GameCreate: React.FC = () => {
  const history = useHistory();

  const handleCreateGame = async (name: string, color: string) => {
    const id = shortid();

    const side = color === "random" ? pickRandom(["white", "black"]) : color;

    await FirebaseDatabase.ref("game")
      .child(id)
      .set({
        [side]: {
          id: FirebaseAuth.currentUser?.uid,
          name,
          online: false,
        },
        fen: START_FEN,
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
        initialValues={{ color: "random" }}
        onFinish={({ name, color }: any) => handleCreateGame(name, color)}
      >
        <Form.Item label="Name" name="name" required={true}>
          <Input placeholder="Your name" />
        </Form.Item>

        <Form.Item label="Color" name="color" required={true}>
          <Select>
            <Select.Option value="random">Random</Select.Option>
            <Select.Option value="white">White</Select.Option>
            <Select.Option value="black">Black</Select.Option>
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
