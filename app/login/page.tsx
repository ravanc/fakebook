import Image from "next/image";
import LogInForm from "../../components/LogInForm";
import SignUpForm from "../../components/SignUpForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-24 bg-yellow-400 flex items-center shadow-sm z-10">
        <h1 className="text-3xl ml-10 font-bold">Fakebook</h1>
        <div className="ml-auto mr-24">
          <LogInForm />
        </div>
      </div>
      <div className="flex-grow grid grid-cols-2">
        <div className="relative w-full h-full">
          <Image
            src={"/cat_splash.png"}
            alt="Splash Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
