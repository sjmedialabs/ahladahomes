"use client"

import { Property, Video } from "@/lib/types"
import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"

interface ImagesMediaStepProps {
  formData: Property
  update: (data: Partial<Property>) => void
}

export default function ImagesMediaStep({ formData, update }: ImagesMediaStepProps) {
  const images = formData.images ?? []
  const videos = formData.videos ?? []
  const brochure = formData.broucher ?? ""

  // ----------------------------
  // IMAGE HANDLERS
  // ----------------------------
  const addImage = () => update({ images: [...images, ""] })

  const updateImage = (index: number, url: string) => {
    const updated = [...images]
    updated[index] = url
    update({ images: updated })
  }

  const removeImage = (index: number) => {
    update({ images: images.filter((_, i) => i !== index) })
  }

  // ----------------------------
  // VIDEO HANDLERS
  // ----------------------------
  const addVideo = () =>
    update({
      videos: [...videos, { videoUrl: "", thumbnailUrl: "" }],
    })

  const updateVideo = (index: number, field: keyof Video, url: string) => {
    const updated = [...videos]
    updated[index] = { ...updated[index], [field]: url }
    update({ videos: updated })
  }

  const removeVideo = (index: number) =>
    update({
      videos: videos.filter((_, i) => i !== index),
    })

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold">Images & Media</h3>

      {/* ---------- IMAGES SECTION ---------- */}
      <div className="space-y-4">
        <h4 className="font-medium">Property Images</h4>

        {images?.map((img, index) => (
          <div key={index} className="flex items-start gap-4 border p-4 rounded-lg">
            <div className="flex-1">
              <FileUpload
                value={img}
                onChange={(url) => updateImage(index, url)}
                placeholder="Upload image"
                accept="image/*"
                className="w-60"
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <Button variant="outline" onClick={addImage}>
          Add Another Image
        </Button>
      </div>

      {/* ---------- VIDEO SECTION ---------- */}
      <div className="space-y-4">
        <h4 className="font-medium">Property Videos</h4>

        {videos?.map((video, index) => (
          <div key={index} className="space-y-3 border p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium text-sm">Video {index + 1}</span>
              {videos.length > 1 && (
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => removeVideo(index)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Video File */}
              <div>
                <label className="text-sm font-medium">Video File</label>
                <FileUpload
                  value={video.videoUrl}
                  onChange={(url) => updateVideo(index, "videoUrl", url)}
                  placeholder="Upload video file"
                  accept="video/*"
                />
              </div>

              {/* Video Thumbnail */}
              <div>
                <label className="text-sm font-medium">Thumbnail Image</label>
                <FileUpload
                  value={video.thumbnailUrl}
                  onChange={(url) => updateVideo(index, "thumbnailUrl", url)}
                  placeholder="Upload video thumbnail"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addVideo}>
          Add Another Video
        </Button>
      </div>

{/* ---------- BROCHURE SECTION ---------- */}
<div className="space-y-6 border-t pt-6 mt-6">
  <h3 className="text-lg font-semibold">Property Brochure</h3>

  {/* PDF Upload */}
  <div className="space-y-2">
    <label className="font-medium text-sm">Brochure PDF</label>
    <FileUpload
      value={formData.broucher?.brochureLink ?? ""}
      onChange={(url) =>
        update({
          broucher: {
            ...formData.broucher,
            brochureLink: url,
          },
        })
      }
      placeholder="Upload brochure PDF"
      accept="application/pdf"
      multiple={false}
      className="w-full"
    />
  </div>

  {/* Thumbnails Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Thumbnail 1 */}
    <div>
      <label className="font-medium text-sm">Thumbnail 1</label>
      <FileUpload
        value={formData.broucher?.brochureThumbnail1 ?? ""}
        onChange={(url) =>
          update({
            broucher: {
              ...formData.broucher,
              brochureThumbnail1: url,
            },
          })
        }
        placeholder="Upload thumbnail"
        accept="image/*"
      />
    </div>

    {/* Thumbnail 2 */}
    <div>
      <label className="font-medium text-sm">Thumbnail 2</label>
      <FileUpload
        value={formData.broucher?.brochureThumbnail2 ?? ""}
        onChange={(url) =>
          update({
            broucher: {
              ...formData.broucher,
              brochureThumbnail2: url,
            },
          })
        }
        placeholder="Upload thumbnail"
        accept="image/*"
      />
    </div>

    {/* Thumbnail 3 */}
    <div>
      <label className="font-medium text-sm">Thumbnail 3</label>
      <FileUpload
        value={formData.broucher?.brochureThumbnail3 ?? ""}
        onChange={(url) =>
          update({
            broucher: {
              ...formData.broucher,
              brochureThumbnail3: url,
            },
          })
        }
        placeholder="Upload thumbnail"
        accept="image/*"
      />
    </div>
  </div>
</div>


      {/* ---------- FEATURED ---------- */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={(e) => update({ featured: e.target.checked })}
          className="rounded"
        />
        <span className="text-sm font-medium">Mark as Featured Property</span>
      </div>
    </div>
  )
}
