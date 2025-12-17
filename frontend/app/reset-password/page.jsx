import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="max-w-sm mx-auto mt-20 p-6 bg-gray-100 rounded shadow text-center">
          Loading form...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
