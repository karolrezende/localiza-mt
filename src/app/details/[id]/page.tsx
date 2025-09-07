import { PersonDetails } from "@/app/details/[id]/PersonDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const num = Number(id);
  return <PersonDetails id={Number.isFinite(num) ? num : 0} />;
}
