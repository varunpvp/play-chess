import React from "react";

export interface ClockSettings {
  timeControl: number; // minutes
  increment: number; // seconds
}

interface ClockSettingsProps {
  onSettingsChange: (settings: ClockSettings) => void;
}

const presets = [
  { label: "3 + 2 (Blitz)", timeControl: 3, increment: 2 },
  { label: "5 + 3 (Blitz)", timeControl: 5, increment: 3 },
  { label: "10 + 0 (Rapid)", timeControl: 10, increment: 0 },
  { label: "15 + 10 (Rapid)", timeControl: 15, increment: 10 },
  { label: "30 + 0 (Classical)", timeControl: 30, increment: 0 },
];

const ClockSettings: React.FC<ClockSettingsProps> = ({ onSettingsChange }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>Time Control:</label>
      <select
        onChange={(e) => {
          const idx = parseInt(e.target.value, 10);
          const preset = presets[idx];
          onSettingsChange({
            timeControl: preset.timeControl,
            increment: preset.increment,
          });
        }}
        defaultValue={0}
      >
        {presets.map((preset, idx) => (
          <option key={idx} value={idx}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClockSettings;
