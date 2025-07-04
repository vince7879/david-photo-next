import { Photo } from "@prisma/client";
import { AlertDialog, Button, ButtonProps, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeletePhotoButton extends ButtonProps {
  photoId: Photo["publicId"];
  galleryColor: Photo["color"];
}

const DeletePhotoButton = ({
  galleryColor,
  photoId,
  ...props
}: DeletePhotoButton) => {
  const router = useRouter();
  const [error, setError] = useState(false);

  const deletePhoto = async () => {
    try {
      await axios.delete(`/api/photos/${galleryColor}/photo/${photoId}`);
      router.push("/dashboard/edit");
    } catch (error) {
      setError(true);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button {...props} color="red">
            Delete Photo
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this photo? This action cannot be
            undone.
          </AlertDialog.Description>
          <Flex mt="4" gap="3">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={deletePhoto}>
                Permanently Delete Photo
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This photo could not be deleted.
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="3"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeletePhotoButton;
