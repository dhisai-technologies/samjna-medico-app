import { buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/utils";
import Link from "next/link";
import { LoginAdminForm } from "./_components/login-admin-form";

export default function AdminLoginPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Link
        href="/auth/login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "absolute right-4 top-4 md:right-8 md:top-8")}
      >
        User Login
      </Link>
      <LoginAdminForm />
    </main>
  );
}
