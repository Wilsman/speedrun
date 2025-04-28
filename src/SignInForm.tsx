"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  // Base button classes
  const baseButtonClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  // Specific button styles
  const primaryButtonClasses =
    "bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-10 px-4 py-2 w-full"; // White bg, dark text
  const secondaryButtonClasses =
    "border border-input bg-card hover:bg-muted text-card-foreground h-10 px-4 py-2"; // Dark bg, white text, outline
  const linkButtonClasses = "text-blue-400 underline-offset-4 hover:underline p-0 h-auto";

  return (
    <div className="w-full max-w-md mx-auto bg-[#1a1a1a] text-white border border-gray-700 rounded-lg p-6 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {flow === "signIn" ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p className="text-sm text-gray-400">
          {flow === "signIn"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            type="button"
            className={`${baseButtonClasses} ${linkButtonClasses}`}
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
      <div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData)
              .catch((_error) => {
                const toastTitle =
                  flow === "signIn"
                    ? "Could not sign in, did you mean to sign up?"
                    : "Could not sign up, did you mean to sign in?";
                toast.error(toastTitle);
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tagilla@factory.com"
              required
              className="flex h-10 w-full rounded-md border border-input bg-[#2a2a2a] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="flex h-10 w-full rounded-md border border-input bg-[#2a2a2a] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            className={`${baseButtonClasses} ${primaryButtonClasses} bg-white text-black hover:bg-gray-200`}
            disabled={submitting}
          >
            {flow === "signIn" ? "Sign In" : "Sign Up"}
          </button>
          <button
            type="button"
            className={`${baseButtonClasses} ${secondaryButtonClasses} border-gray-600 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white col-span-2`}
            disabled={submitting}
            onClick={() => void signIn("anonymous")}
          >
            Sign in anonymously
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a1a1a] px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`${baseButtonClasses} ${secondaryButtonClasses} border-gray-600 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white`}
            disabled={submitting}
            onClick={() => void signIn("github")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </button>
          <button
            type="button"
            className={`${baseButtonClasses} ${secondaryButtonClasses} border-gray-600 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white`}
            disabled={submitting}
            onClick={() => void signIn("google")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 256 262"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              className="mr-2"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              />
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              />
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              />
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              />
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
