'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type StatusFilter = 'all' | 'active' | 'inactive' | 'trashed';

interface Props {
  status: StatusFilter;
  search: string;
  onStatusChange: (value: StatusFilter) => void;
  onSearchChange: (value: string) => void;
}

export default function HeroBannerFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-end">
      {/* Search */}
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by title or subtitle..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-1.5"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full md:w-48">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => onStatusChange(value as StatusFilter)}>
          <SelectTrigger id="status" className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Banners</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="trashed">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
