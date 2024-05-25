import Image from "next/image";
import MultiFileUploader from "@/components/MultiFileUploader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 gap-10">
      <MultiFileUploader />
    </main>
  );
}
