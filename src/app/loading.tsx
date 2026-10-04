import LuxuryLoader from "@/components/ui/LuxuryLoader";

export default function Loading() {
  return (
    <div className="flex-1 min-h-[70vh] flex items-center justify-center bg-[#f8f5f2] px-4 py-20">
      <LuxuryLoader size="md" text="MUSE" />
    </div>
  );
}
