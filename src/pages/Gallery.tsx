import Layout from "@/components/Layout";
import PhotoGallery from "@/components/PhotoGallery";
import { Camera, Image } from "lucide-react";

const Gallery = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Camera className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Capturing moments of faith, fellowship, and community. Browse through our collection 
              of photos from church events, services, and special occasions.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Image className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Church Memories</h2>
            </div>
            <PhotoGallery />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Gallery;