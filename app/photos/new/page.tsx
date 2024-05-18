"use client";

import { Button, Callout, Select, Text, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPhotoSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";

type PhotoForm = z.infer<typeof createPhotoSchema>;

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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhotoForm>({
    resolver: zodResolver(createPhotoSchema),
  });
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="max-w-xl space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/photos", data);
            router.push("/photos");
          } catch (error) {
            setError("An unexpected error occured.");
          }
        })}
      >
        <TextField.Root placeholder="Place" {...register("place")} />
        <ErrorMessage>{errors.place?.message}</ErrorMessage>
        {/* rework spacing between selects and submit btn */}
        <div>
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
          <ErrorMessage>{errors.month?.message}</ErrorMessage>
        </div>
        <div>
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
          <ErrorMessage>{errors.color?.message}</ErrorMessage>
        </div>
        <Button className="my-3">Submit New Photo</Button>
      </form>
    </div>
  );
};

export default NewPhotoPage;
