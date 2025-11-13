"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names
import { TablesInsert } from "@/types/supabase"; // Import TablesInsert type

const AppraisalPage = () => {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemHistory, setItemHistory] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission loading

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!itemName || !itemCategory || !itemDescription || !itemCondition || !agreeTerms || !imageFile) {
      toast.error("Please fill in all required fields, upload an image, and agree to the terms.");
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | null = null;

    try {
      // 1. Upload image to Supabase Storage
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `appraisal_images/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('appraisal-images') // Ensure you have a bucket named 'appraisal-images'
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('appraisal-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;

      // 2. Insert appraisal request into Supabase database
      const newAppraisalRequest: TablesInsert<'appraisal_requests'> = {
        item_name: itemName,
        item_category: itemCategory,
        item_description: itemDescription,
        item_history: itemHistory || null, // Ensure null if empty string
        item_condition: itemCondition,
        image_url: imageUrl,
        agreed_terms: agreeTerms,
        // user_id: (await supabase.auth.getUser()).data.user?.id, // Uncomment when authentication is fully set up
      };

      const { data, error: insertError } = await supabase
        .from('appraisal_requests')
        .insert([newAppraisalRequest])
        .select(); // Select the inserted data to get the ID

      if (insertError) {
        throw insertError;
      }

      const newRequestId = data?.[0]?.id;

      if (!newRequestId) {
        throw new Error("Failed to retrieve new request ID after insertion.");
      }

      toast.success("Appraisal request submitted! We're processing your request.");

      // Navigate to a pending or result page, passing the request ID
      // The actual appraisal result will be fetched or generated on the backend
      navigate(`/appraisal-result/${newRequestId}`);

    } catch (error: any) {
      console.error("Appraisal submission error:", error);
      toast.error(`Failed to submit appraisal: ${error.message || 'An unknown error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Appraise Your Item</CardTitle>
          <CardDescription>Provide details about your item to get an estimated appraisal.</CardDescription>
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
                placeholder="e.g., Vintage Rolex Watch"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemCategory">Category</Label>
              <Select onValueChange={setItemCategory} value={itemCategory} required>
                <SelectTrigger id="itemCategory">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fine Art">Fine Art</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Antiques">Antiques</SelectItem>
                  <SelectItem value="Collectibles">Collectibles</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemDescription">Description</Label>
              <Textarea
                id="itemDescription"
                placeholder="Describe your item in detail (e.g., materials, dimensions, unique features)"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemHistory">History/Provenance (Optional)</Label>
              <Textarea
                id="itemHistory"
                placeholder="Any known history, previous owners, or origin story"
                value={itemHistory}
                onChange={(e) => setItemHistory(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemCondition">Condition</Label>
              <Select onValueChange={setItemCondition} value={itemCondition} required>
                <SelectTrigger id="itemCondition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent (Like New)</SelectItem>
                  <SelectItem value="Good">Good (Minor Wear)</SelectItem>
                  <SelectItem value="Fair">Fair (Visible Wear/Minor Damage)</SelectItem>
                  <SelectItem value="Poor">Poor (Significant Damage)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                required
              />
              <label
                htmlFor="agreeTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions for appraisal.
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Get Appraisal"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default AppraisalPage;