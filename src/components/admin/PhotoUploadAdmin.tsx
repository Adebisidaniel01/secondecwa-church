import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Image as ImageIcon, Star } from "lucide-react";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  category: string | null;
  is_featured: boolean | null;
  upload_date: string;
}

const PhotoUploadAdmin = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    is_featured: false
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        toast({
          title: "Error",
          description: "Failed to fetch photos",
          variant: "destructive",
        });
        return;
      }

      setPhotos(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate all files
    const validFiles: File[] = [];
    let hasErrors = false;

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        hasErrors = true;
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        hasErrors = true;
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      if (!hasErrors) {
        toast({
          title: "Files Selected",
          description: `${validFiles.length} file(s) ready to upload`,
        });
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !formData.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select at least one file and enter a title",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Get admin session token
      const sessionToken = localStorage.getItem('admin_token');
      if (!sessionToken) {
        toast({
          title: "Unauthorized",
          description: "Please log in as admin",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileTitle = selectedFiles.length > 1 ? `${formData.title} ${i + 1}` : formData.title;

        try {
          // Convert file to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result?.toString().split(',')[1];
              if (result) resolve(result);
              else reject(new Error('Failed to read file'));
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const { error } = await supabase.functions.invoke('photo-upload', {
            body: {
              action: 'upload',
              sessionToken,
              title: fileTitle,
              description: formData.description || null,
              category: formData.category,
              is_featured: formData.is_featured && i === 0, // Only first image is featured
              file: base64,
              fileName: file.name
            }
          });

          if (error) {
            console.error('Upload error for', file.name, ':', error);
            failCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error('Error uploading', file.name, ':', err);
          failCount++;
        }
      }

      // Show summary toast
      if (successCount > 0 && failCount === 0) {
        toast({
          title: "Success",
          description: `${successCount} photo(s) uploaded successfully`,
        });
      } else if (successCount > 0 && failCount > 0) {
        toast({
          title: "Partial Success",
          description: `${successCount} uploaded, ${failCount} failed`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload photos",
          variant: "destructive",
        });
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "general",
        is_featured: false
      });
      setSelectedFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh photos list
      fetchPhotos();
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

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const sessionToken = localStorage.getItem('admin_token');
      if (!sessionToken) {
        toast({
          title: "Unauthorized",
          description: "Please log in as admin",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.functions.invoke('photo-upload', {
        body: {
          action: 'delete',
          sessionToken,
          photoId
        }
      });

      if (error) {
        console.error('Delete error:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete photo",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });

      fetchPhotos();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="photo-upload">Photo File</Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max file size: 10MB per file. Supported formats: JPG, PNG, GIF, WebP. Select multiple files to upload at once.
              </p>
              {selectedFiles.length > 0 && (
                <p className="text-sm font-medium text-primary mt-2">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Photo title"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="worship">Worship</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="ministry">Ministry</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="holidays">Holidays</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="featured">Featured Photo</Label>
            </div>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={uploading || selectedFiles.length === 0 || !formData.title.trim()}
            className="w-full md:w-auto"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Photos List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Uploaded Photos ({photos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No photos uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border rounded-lg overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={photo.file_url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    {photo.is_featured && (
                      <Badge className="absolute top-2 right-2 bg-primary/90">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium mb-1 line-clamp-1">{photo.title}</h4>
                    {photo.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {photo.category && (
                          <Badge variant="outline" className="text-xs">
                            {photo.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(photo.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoUploadAdmin;