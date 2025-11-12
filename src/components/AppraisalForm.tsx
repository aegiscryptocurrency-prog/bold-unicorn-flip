"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

const AppraisalForm = () => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile) {
      toast.error("Please upload an image of the item.");
      return;
    }
    // In a real application, this would send data to a backend API
    // for image recognition, AI appraisal, and web scraping.
    console.log({ itemName, itemDescription, itemCategory, imageFile });
    toast.success("Item submitted for appraisal! (Backend integration needed)");
    // Reset form
    setItemName("");
    setItemDescription("");
    setItemCategory("");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Appraise Your Item</CardTitle>
        <CardDescription>Upload an image and provide details for an appraisal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="itemImage">Item Image</Label>
            <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Item preview" className="max-h-full max-w-full object-contain rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF (MAX. 800x400px)</p>
                  </div>
                )}
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              placeholder="e.g., Vintage Rolex Watch, Roman Coin"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemCategory">Category</Label>
            <Input
              id="itemCategory"
              placeholder="e.g., Watch, Coin, Painting, Gemstone"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemDescription">Description</Label>
            <Textarea
              id="itemDescription"
              placeholder="Provide any known details about the item, its origin, condition, etc."
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">Get Appraisal</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppraisalForm;