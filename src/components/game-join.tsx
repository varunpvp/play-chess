import { Button, Form, Input, Typography } from "antd";
import React from "react";

const GameJoin: React.FC<{ onJoin: (name: string) => void }> = ({ onJoin }) => {
  return (
    <div className="container-sm mt-md">
      <Typography.Title className="text-center" level={3}>
        Join game
      </Typography.Title>

      <Form
        requiredMark={false}
        layout="vertical"
        onFinish={({ name }) => onJoin(name)}
      >
        <Form.Item name="name" required={true}>
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Button type="primary" block htmlType="submit">
          Join
        </Button>
      </Form>
    </div>
  );
};

export default GameJoin;
