import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizCardProps {
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts?: number;
}

export function QuizCard({ title, description, passingScore, maxAttempts }: QuizCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">Passing Score: {passingScore}%</p>
          {maxAttempts && <p className="text-sm">Max Attempts: {maxAttempts}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

