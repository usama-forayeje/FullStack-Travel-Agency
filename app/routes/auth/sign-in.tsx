import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user.$id) return redirect("/");
  } catch (error) {
    console.error("Error fetching user in clientLoader (SignIn):", error);
  }
  return null;
}

function SignIn() {
  const handleSignInWithGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <main className="auth min-h-screen flex items-center justify-center p-4">
      <section className="relative w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl -z-10 animate-fade-in"></div>

        <div className="w-full relative z-10">
          <header className="mb-8 flex flex-col items-center">
            <Link
              to="/"
              className="mb-4 transition-transform duration-300 hover:scale-105"
            >
              <img
                src="/assets/icons/logo.svg"
                alt="Travel Planner Logo"
                className="w-14 h-14"
              />
            </Link>
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Travel Planner
            </h1>
          </header>
          <article className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">
              Start Your Travel Journey
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              Sign In with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>
          <button
            onClick={handleSignInWithGoogle}
            type="button"
            className="flex cursor-pointer items-center justify-center w-full px-6 py-3 bg-white text-gray-800 font-semibold text-lg rounded-full shadow-xl
                       hover:bg-blue-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4
                       focus:ring-blue-400 focus:ring-opacity-75 transform hover:-translate-y-0.5 active:scale-95"
            aria-label="Sign in with Google"
          >
            <img
              src="/assets/icons/google.svg"
              alt="Google logo"
              className="w-6 h-6 mr-3"
            />
            <span className="text-lg font-semibold">Sign In with Google</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
