import React from "react";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import shortid from "shortid";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Select, Typography } from "antd";
import { makeGame } from "../utils/chess";
import { GameColor } from "../types/game";
import { pickRandom } from "../utils";

const GameCreate: React.FC = () => {
  const history = useHistory();
  const userId = FirebaseAuth.currentUser?.uid!;

  const handleCreateGame = async (
    name: string,
    color: GameColor | "random"
  ) => {
    const id = shortid();

    await FirebaseDatabase.ref("game")
      .child(id)
      .set(
        makeGame({
          userId,
          userColor:
            color === "random"
              ? pickRandom<GameColor>(["white", "black"])
              : color,
          userName: name,
        })
      );

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

export default GameCreate;
