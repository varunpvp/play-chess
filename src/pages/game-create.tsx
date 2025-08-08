import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Select, Typography } from "antd";
import { GameColor } from "../types/game";
import { createGame, pickRandom } from "../utils";
import ClockSettings, {
  ClockSettings as ClockSettingsType,
} from "../components/clock-settings";

const GameCreate: React.FC = () => {
  const history = useHistory();
  const [clockSettings, setClockSettings] = useState<ClockSettingsType>({
    timeControl: 3,
    increment: 2,
  });

  const handleCreateGame = async (
    name: string,
    color: GameColor | "random"
  ) => {
    const gameId = await createGame(
      name,
      color === "random" ? pickRandom<GameColor>(["white", "black"]) : color,
      clockSettings
    );

    history.push(`/${gameId}`);
  };

  return (
    <div className="container-sm mt-md">
      <Typography.Title className="text-center" level={3}>
        Play Chess
      </Typography.Title>

      <Typography.Title className="text-center" level={4}>
        Create a Game
      </Typography.Title>

      <ClockSettings onSettingsChange={setClockSettings} />

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
