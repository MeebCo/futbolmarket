import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Trophy className="h-12 w-12 text-silver mb-4" />
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="mt-2 text-sm text-silver">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/markets" className="mt-6">
        <Button>
          <Trophy className="h-4 w-4" />
          Browse Markets
        </Button>
      </Link>
    </div>
  );
}
