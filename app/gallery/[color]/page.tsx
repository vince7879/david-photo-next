import Gallery from "@/app/gallery/components/Gallery/Gallery";
import NavBarGallery from "@/app/components/NavBar/NavBarGallery/NavBarGallery";
import prisma from "@/prisma/client";
import { Color } from "@prisma/client";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  return Object.values(Color).map((color) => ({
    color,
  }));
}

export interface GalleryPageProps {
  params: { color: Color };
}

const GalleryPage: React.FC<GalleryPageProps> = async ({
  params: { color },
}) => {
  const photos = await prisma.photo.findMany({
    where: { color },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <>
      <aside>
        <NavBarGallery currentColor={color} />
      </aside>

      <Gallery currentColor={color} photos={photos} />
    </>
  );
};

export default GalleryPage;
