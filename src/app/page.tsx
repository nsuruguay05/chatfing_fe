import QuestionAnsweringPlatform from '@/components/QuestionAnsweringPlatform';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm">
        <QuestionAnsweringPlatform />
      </div>
    </main>
  );
}