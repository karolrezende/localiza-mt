import { Person } from "@/types/person.type";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonCard } from "./PersonCard";

interface Props {
  people: Person[];
  loading?: boolean;
  imageSkeleton?: boolean;
}

export function PersonGrid({ people, loading, imageSkeleton }: Props) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-[320px] w-full rounded-[22px]" />
        ))}
      </div>
    );
  }

  if (!people.length) {
    return (
      <p
        className="text-center text-muted-foreground mt-8"
        role="status"
        aria-live="polite"
      >
        Nenhum resultado encontrado.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-6">
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          imageSkeleton={imageSkeleton}
        />
      ))}
    </div>
  );
}
