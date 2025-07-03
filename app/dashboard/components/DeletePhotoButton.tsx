import { Photo } from "@prisma/client";
import { AlertDialog, Button, ButtonProps, Flex } from "@radix-ui/themes";

interface DeletePhotoButton extends ButtonProps {
  photoId: Photo["publicId"];
}

const DeletePhotoButton = ({ photoId, ...props }: DeletePhotoButton) => {
  return (
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
            <Button color="red">Permanently Delete Photo</Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeletePhotoButton;
