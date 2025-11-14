import Layout from "@/components/Layout";
import PhotoGallery from "@/components/PhotoGallery";
import { Camera, Image } from "lucide-react";
import galleryHeader from "@/assets/church-hero.jpg";

const Gallery = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${galleryHeader})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
                Photo Gallery
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Capturing moments of faith, fellowship, and community. Browse through our collection 
                of photos from church events, services, and special occasions.
              </p>
            </div>
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