export const NegativeScreen = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-red-500">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        The page you're looking for doesn’t exist or was moved.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition"
      >
        Go Home
      </a>
    </div>
  );
};
