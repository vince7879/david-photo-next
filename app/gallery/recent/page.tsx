import Gallery from "@/app/gallery/components/Gallery/Gallery";
import prisma from "@/prisma/client";
import { sortPhotosByDateDesc } from "@/app/constants";
import NavBarGallery from "@/app/components/NavBar/NavBarGallery/NavBarGallery";

export const dynamic = "force-static";
export const revalidate = 3600;

const RecentGalleryPage = async () => {
  // fetch all photos from the database
  const allPhotos = await prisma.photo.findMany();

  // sort photos from most recent to least recent
  const sortedPhotos = allPhotos.sort(sortPhotosByDateDesc);

  // take the 48 most recent photos
  const photos = sortedPhotos.slice(0, 48);

  return (
    <>
      <aside>
        <NavBarGallery />
      </aside>
      <Gallery photos={photos} isRecent={true} />
    </>
  );
};

export default RecentGalleryPage;
