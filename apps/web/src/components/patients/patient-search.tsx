import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchProps {
  searchValue: string;
  onSearch: (search: string) => void;
}
export default function PatientSearch({
  searchValue,
  onSearch,
}: PatientSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search patients by name, email, or phone..."
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
