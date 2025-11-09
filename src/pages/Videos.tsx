import Layout from "@/components/Layout";
import VideoGallery from "@/components/VideoGallery";

const Videos = () => {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Videos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch our latest sermons, teachings, and special events
          </p>
        </div>

        {/* Video Gallery */}
        <VideoGallery />
      </div>
    </Layout>
  );
};

export default Videos;