import Picture from "./components/common/Picture";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Picture
        src="/images/rosie-paws-logo.jpg"
        className="aspect-[10/13] w-full h-full max-h-96 object-contain"
        priority={true}
      />
    </div>
  );
}
