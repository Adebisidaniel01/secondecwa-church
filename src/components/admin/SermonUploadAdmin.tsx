import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Video } from "lucide-react";

const SermonUploadAdmin = () => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    date: "",
    scripture: "",
    description: "",
    series: "",
    duration: "",
    audio_url: "",
    video_url: "",
    is_featured: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.speaker || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { error } = await supabase
        .from('sermons')
        .insert({
          title: formData.title,
          speaker: formData.speaker,
          date: formData.date,
          scripture: formData.scripture || null,
          description: formData.description || null,
          series: formData.series || null,
          duration: formData.duration ? parseInt(formData.duration) : null,
          audio_url: formData.audio_url || null,
          video_url: formData.video_url || null,
          is_featured: formData.is_featured
        });

      if (error) {
        console.error('Error uploading sermon:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload sermon",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Sermon uploaded successfully",
      });

      // Reset form
      setFormData({
        title: "",
        speaker: "",
        date: "",
        scripture: "",
        description: "",
        series: "",
        duration: "",
        audio_url: "",
        video_url: "",
        is_featured: false
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Upload Sermon
        </CardTitle>
        <CardDescription>
          Add sermon details and media links. The sermon will appear on the Sermons page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sermon title"
                required
              />
            </div>

            <div>
              <Label htmlFor="speaker">Speaker *</Label>
              <Input
                id="speaker"
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                placeholder="Speaker name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="scripture">Scripture</Label>
              <Input
                id="scripture"
                value={formData.scripture}
                onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                placeholder="e.g., John 3:16"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 30"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Sermon description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="series">Series</Label>
              <Input
                id="series"
                value={formData.series}
                onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                placeholder="e.g., Faith Over Fear"
              />
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="featured">Featured Sermon</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <Label htmlFor="audio_url">Audio URL</Label>
              <Input
                id="audio_url"
                type="url"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <Button type="submit" disabled={uploading} className="w-full md:w-auto">
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Sermon
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SermonUploadAdmin;
