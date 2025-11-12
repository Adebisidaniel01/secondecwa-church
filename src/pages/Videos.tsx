import Layout from "@/components/Layout";
import VideoGallery from "@/components/VideoGallery";
import videosHeader from "@/assets/sermon-scene.jpg";

const Videos = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${videosHeader})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Videos
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Watch our latest sermons, teachings, and special events
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        {/* Video Gallery */}
        <VideoGallery />
      </div>
    </Layout>
  );
};

export default Videos;