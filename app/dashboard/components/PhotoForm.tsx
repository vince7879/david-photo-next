"use client";

import { Button, Callout, Flex, Select, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPhotoSchema } from "@/app/validationSchemas";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { Color, Photo } from "@prisma/client";
import NavBarDashboard from "@/app/components/NavBar/NavBarDashboard/NavBarDashboard";
import DeletePhotoButton from "./DeletePhotoButton";

type PhotoFormData = z.infer<typeof createPhotoSchema>;

interface PhotoFormProps {
  photoData?: Photo;
}

const PhotoForm: React.FC<PhotoFormProps> = ({ photoData }) => {
  // @todo: to move to a global constant file
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

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null | undefined>(
    null
  );
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PhotoFormData>({
    resolver: zodResolver(createPhotoSchema),
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPhotoPreview(photoData?.photoUrl);
  }, [photoData?.photoUrl]);

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
          const reader = new FileReader();

          reader.onload = (e) => {
            const result = e.target?.result as string;
            setPhotoPreview(result);
            setPhoto(compressedPhoto);

            const img = new window.Image();
            img.onload = () => {
              setIsPortrait(img.height > img.width + img.height * 0.1);
            };
            img.src = result;
          };

          reader.readAsDataURL(compressedPhoto);
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
      let photoUploadResult;

      if (!photoData) {
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

        photoUploadResult = await cloudinaryResponse.data;
      }

      // Add the uploaded photo and its format to the payload
      const payload = {
        ...data,
        ...(!photoData && {
          photoUrl: photoUploadResult.secure_url,
          publicId: photoUploadResult.public_id,
          isPortrait,
        }),
      };

      if (photoData) {
        await axios.patch(
          `/api/photos/${photoData.color}/photo/${photoData.publicId}`,
          data
        );
      } else {
        await axios.post("/api/photos", payload);
      }

      reset();
      setPhotoPreview(null);
      // @todo: remove the message as soon as an input is touch
      setSubmitMessage(
        `photo ${photoData ? "updated" : "added"} successfully!`
      );
    } catch (error) {
      setSubmitMessage("An unexpected error occured.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <aside>
        <NavBarDashboard />
      </aside>
      <div className="flex gap-4 items-start">
        <div className="max-w-xl">
          <h1 className="mb-5 text-3xl font-bold">
            {photoData ? "Edit the photo" : "Add a new photo"}
          </h1>
          <form className="max-w-xl space-y-4" onSubmit={onSubmit}>
            <TextField.Root
              defaultValue={photoData?.place}
              placeholder="Place"
              {...register("place")}
            />
            <ErrorMessage>{errors.place?.message}</ErrorMessage>
            {/* rework spacing between selects and submit btn */}
            <Flex>
              <div className="mr-5">
                <Controller
                  name="year"
                  control={control}
                  defaultValue={photoData?.year}
                  render={({ field }) => (
                    <Select.Root
                      {...field}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger placeholder="Year" />
                      <Select.Content position="popper">
                        {Array.from(
                          { length: new Date().getFullYear() - 2006 + 1 },
                          (_v, mostOne) => `${2006 + mostOne}`
                        )
                          .reverse()
                          .map((year) => (
                            <Select.Item key={year} value={year}>
                              {year}
                            </Select.Item>
                          ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                <ErrorMessage>{errors.year?.message}</ErrorMessage>
              </div>
              <div className="mr-5">
                <Controller
                  name="month"
                  control={control}
                  defaultValue={photoData?.month}
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
                  // @todo: fix when a photo is updated the dropdown displays the old one
                  // it's because the url keeps the old color
                  defaultValue={photoData?.color}
                  render={({ field }) => (
                    <Select.Root
                      {...field}
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger placeholder="Color" />
                      <Select.Content position="popper">
                        {Object.values(Color).map((color) => (
                          <Select.Item key={color} value={color}>
                            {color === "blackwhite" ? "black and white" : color}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                <ErrorMessage>{errors.color?.message}</ErrorMessage>
              </div>
            </Flex>
            {!photoData && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            )}
            <Button disabled={isSubmitting}>
              {photoData ? "Update Photo" : "Submit New Photo"}{" "}
              {isSubmitting && <Spinner />}
            </Button>
            {photoData && (
              <DeletePhotoButton
                photoId={photoData.publicId}
                galleryColor={photoData.color}
                ml="5"
              />
            )}
          </form>
          {submitMessage && (
            <Callout.Root
              color={submitMessage.includes("success") ? "green" : "red"}
              mt="5"
            >
              <Callout.Text>{submitMessage}</Callout.Text>
            </Callout.Root>
          )}
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
    </>
  );
};

export default PhotoForm;
