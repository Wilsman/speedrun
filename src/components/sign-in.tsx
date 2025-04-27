import { useAuthActions } from "@convex-dev/auth/react";

export function SignIn() {
  const { signIn } = useAuthActions();
  return (
    <button
      type="button"
      onClick={() => void signIn("github")}
      className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors"
    >
      Sign in with GitHub
    </button>
  );
}
