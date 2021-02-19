import { Typography } from "antd";

const GameInvite = () => {
  return (
    <div className="container-sm mt-md text-center">
      <Typography.Title level={3}>Invite a friend</Typography.Title>

      <Typography.Title level={4}>
        Share the link and ask you friend to join
      </Typography.Title>

      <Typography.Paragraph copyable>
        {window.location.href}
      </Typography.Paragraph>
    </div>
  );
};

export default GameInvite;
