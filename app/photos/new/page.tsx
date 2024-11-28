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
import Spinner from "@/app/components/Spinner";
import Image from "next/image";
import imageCompression from "browser-image-compression";

type PhotoForm = z.infer<typeof createPhotoSchema>;

const NewPhotoPage = () => {
  // @todo to move to a global constant file
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

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(
    null
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PhotoForm>({
    resolver: zodResolver(createPhotoSchema),
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let compressedPhoto: File | null = null;
    const photoFile = event.target.files?.[0];

    if (photoFile) {
      // console.log("originalFile instanceof Blob", photoFile instanceof Blob); // true
      // console.log(`originalFile size ${photoFile.size / 1024 / 1024} MB`);

      const options = {
        maxSizeMB: 7,
        maxWidthOrHeight: 2500,
      };
      try {
        compressedPhoto = await imageCompression(photoFile, options);
        // console.log(
        //   "compressedPhoto instanceof Blob",
        //   compressedPhoto instanceof Blob
        // ); // true
        // console.log(
        //   `compressedPhoto size ${compressedPhoto.size / 1024 / 1024} MB`
        // ); // smaller than maxSizeMB

        if (compressedPhoto) {
          setPhoto(compressedPhoto);
          const reader = new FileReader();
          reader.onload = (e) => {
            setPhotoPreview(e.target?.result as string);
          };
          reader.readAsDataURL(compressedPhoto); // Reads the file as a data URL (base64)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (photo) {
        formData.append("file", photo);
        formData.append("upload_preset", "x2bx90y9");
      }

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dnaf0ui17/image/upload",
        formData
      );

      if (cloudinaryResponse.status !== 200) {
        throw new Error("Photo upload failed");
      }

      const photoUploadResult = await cloudinaryResponse.data;

      // Add the uploaded photo url to the form data
      const payload = {
        ...data,
        photoUrl: photoUploadResult.secure_url,
      };

      await axios.post("/api/photos", payload);
      
      reset();
      setPhotoPreview(null)
      // @todo change color alert when it's a success
      // @todo remove the message as soon as an input is touch
      setError("photo added successfully !");
    } catch (error) {
      setError("An unexpected error occured.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="flex gap-4 items-start">
      <div className="max-w-xl">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
          <TextField.Root placeholder="Place" {...register("place")} />
          <ErrorMessage>{errors.place?.message}</ErrorMessage>
          {/* rework spacing between selects and submit btn */}
          <div>
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <Select.Root
                  {...field}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
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
                <Select.Root
                  {...field}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
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
          <div>
            <input type="file" accept="image/*" onChange={handleFileSelect} />
          </div>
          <Button disabled={isSubmitting} className="my-3">
            Submit New Photo {isSubmitting && <Spinner />}
          </Button>
        </form>
      </div>
      {photoPreview && (
        <Image
          src={photoPreview}
          alt="Aperçu de l'image"
          width={500}
          height={180}
          style={{ objectFit: "contain", maxHeight: "500px" }}
        />
      )}
    </div>
  );
};

export default NewPhotoPage;
