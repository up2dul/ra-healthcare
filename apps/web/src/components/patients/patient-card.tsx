import { User } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PatientCardProps {
  patient: {
    name: string;
    email: string;
    phone: string;
    gender: string;
  };
}

export default function PatientCard({ patient }: PatientCardProps) {
  return (
    <Card size="sm" className="transition-colors hover:bg-muted/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <User className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription>
              {[patient.email, patient.phone].filter(Boolean).join(" · ") ||
                "No contact info"}
            </CardDescription>
          </div>
          {patient.gender && (
            <span className="text-muted-foreground text-xs capitalize">
              {patient.gender}
            </span>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
