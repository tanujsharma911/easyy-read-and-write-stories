"use client";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/shadcn-io/image-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ChangeEvent, useState } from "react";

interface ImageCropCompProps {
  image: string | null;
  setImage: (image: string | null) => void;
}

const ImageCropComp = ({ image, setImage }: ImageCropCompProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  //   const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImage(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImage(null);
  };

  if (!selectedFile) {
    return (
      <Input
        accept="image/*"
        className="w-fit shadow-none text-gray-400"
        onChange={handleFileChange}
        type="file"
      />
    );
  }

  if (image) {
    return (
      <div className="space-y-4 relative">
        {/* ✅ Use normal img tag instead of Next.js <Image /> */}
        <img
          src={image}
          alt="Cropped"
          width={1000}
          height={1000}
          style={{
            objectFit: "cover",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
          }}
        />
        <Button
          onClick={handleReset}
          size="sm"
          type="button"
          variant="outline"
          className="absolute top-2 right-2"
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={2}
        file={selectedFile}
        maxImageSize={1024 * 1024 * 5} // 5MB
        // onChange={console.log}
        onComplete={console.log}
        onCrop={setImage}
      >
        <ImageCropContent className="max-w-md" />
        <div className="flex items-center gap-2">
          <ImageCropApply asChild>
            <Button size="sm" variant="outline">
              Apply Crop
            </Button>
          </ImageCropApply>
          <ImageCropReset asChild>
            <Button size="sm" variant="outline">
              Reset
            </Button>
          </ImageCropReset>
          <Button
            onClick={handleReset}
            size="sm"
            type="button"
            variant="outline"
          >
            Change
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
};

export default ImageCropComp;
