export default function FormMessage({ message, type = "error" }) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "bg-red-100 text-red-700 border border-red-300"
      : "bg-green-100 text-green-700 border border-green-300";

  return (
    <div className={`mb-4 p-3 text-sm rounded-lg ${styles}`}>{message}</div>
  );
}
