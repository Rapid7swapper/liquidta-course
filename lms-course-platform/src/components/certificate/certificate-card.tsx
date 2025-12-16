import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CertificateCardProps {
  courseTitle: string;
  certificateId: string;
  issuedAt: Date;
}

export function CertificateCard({ courseTitle, certificateId, issuedAt }: CertificateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{courseTitle}</CardTitle>
        <CardDescription>Certificate of Completion</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge>Verified</Badge>
          <p className="text-sm text-muted-foreground">
            Issued: {new Date(issuedAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">ID: {certificateId}</p>
        </div>
      </CardContent>
    </Card>
  );
}

