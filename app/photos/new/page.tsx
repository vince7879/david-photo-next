"use client";

import { Button, Select, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface PhotoForm {
  place: string;
  month: string;
  color: string;
}

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

  const { register, control, handleSubmit } = useForm<PhotoForm>();
  const router = useRouter()

  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async (data) => {
        await axios.post("/api/photos", data);
        router.push('/photos')
      })}
    >
      <TextField.Root placeholder="Place" {...register("place")} />
      {/* rework spacing between selects and submit btn */}
      <Controller
        name="month"
        control={control}
        render={({ field }) => (
          <Select.Root {...field} onValueChange={field.onChange}>
            <Select.Trigger placeholder="Month" />
            <Select.Content position="popper">
              {months.map((month) => (
                <Select.Item key={month} value={month}>
                  {month}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      />

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <Select.Root {...field} onValueChange={field.onChange}>
            <Select.Trigger placeholder="Color" />
            <Select.Content position="popper">
              {colors.map((color) => (
                <Select.Item key={color} value={color}>
                  {color}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      />
      <Button className="my-3">Submit New Photo</Button>
    </form>
  );
};

export default NewPhotoPage;
