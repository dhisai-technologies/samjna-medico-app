import { FlipWords } from "@/components/ui/flip-words";
import { appConfig } from "@ui-utils/config";
import { Icons } from "@ui/components/icons";
import { Copyright } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-background lg:flex">
        <div className="absolute inset-0 bg-foreground" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <Icons.logo />
          <div>
            <h3>{appConfig.title}</h3>
            <p className="text-muted-foreground text-sm">By {appConfig.company}</p>
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <div className="text-2xl mx-auto font-normal text-muted-foreground">
            Building
            <FlipWords words={["scalable", "secured", "state-of-the-art", "innovative"]} /> <br />
            <span>AI Models for medical department</span>
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <p className="flex text-muted-foreground text-xs items-center gap-2">
            <Copyright className="w-3 h-3" />
            <span>
              {appConfig.copyright}, {appConfig.company}
            </span>
          </p>
        </div>
      </div>
      <div className="lg:p-8 relative w-full h-full">
        <div className="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
