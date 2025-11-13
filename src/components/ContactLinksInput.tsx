"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusIcon, XIcon } from "lucide-react";

interface ContactLink {
  type: string;
  value: string;
}

interface ContactLinksInputProps {
  value: ContactLink[];
  onChange: (links: ContactLink[]) => void;
}

const ContactLinksInput: React.FC<ContactLinksInputProps> = ({ value, onChange }) => {
  const handleAddLink = () => {
    onChange([...value, { type: 'email', value: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = value.filter((_, i) => i !== index);
    onChange(newLinks);
  };

  const handleLinkChange = (index: number, field: keyof ContactLink, fieldValue: string) => {
    const newLinks = value.map((link, i) =>
      i === index ? { ...link, [field]: fieldValue } : link
    );
    onChange(newLinks);
  };

  return (
    <div className="grid gap-4">
      <Label>Contact Links</Label>
      {value.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={link.type}
            onValueChange={(type) => handleLinkChange(index, 'type', type)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Link value"
            value={link.value}
            onChange={(e) => handleLinkChange(index, 'value', e.target.value)}
            className="flex-grow"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleRemoveLink(index)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddLink} className="w-full">
        <PlusIcon className="h-4 w-4 mr-2" /> Add Contact Link
      </Button>
    </div>
  );
};

export default ContactLinksInput;