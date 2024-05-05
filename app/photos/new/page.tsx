"use client";

import { Box, Button, Flex, Select, TextField } from "@radix-ui/themes";
import React from "react";

const NewPhotoPage = () => {
  // to move to a global constant file
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const colors = [
    "black",
    "white",
    "red",
    "yellow",
    "brown",
    "grey",
    "purple",
    "blue",
    "green",
    "black-white",
  ];

  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root placeholder="Place"></TextField.Root>
      {/* rework spacing between selects and submit btn */}
      <Select.Root>
        <Select.Trigger placeholder="Month" />
        <Select.Content position="popper">
          {months.map((month) => (
            <Select.Item key={month} value={month}>
              {month}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root>
        <Select.Trigger placeholder="Color" />
        <Select.Content position="popper">
          {colors.map((color) => (
            <Select.Item key={color} value={color}>
              {color}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Button className="my-3">Submit New Photo</Button>
    </div>
  );
};

export default NewPhotoPage;
