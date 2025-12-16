import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export function CourseCard({ id, title, description, imageUrl }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Link href={`/student/courses/${id}`}>
          <Button>View Course</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

