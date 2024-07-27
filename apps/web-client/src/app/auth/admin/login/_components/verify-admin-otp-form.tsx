import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@ui-utils/helpers";
import { Loaders } from "@ui/components/loaders";
import { Button } from "@ui/components/ui/button";
import { Form, FormError } from "@ui/components/ui/form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@ui/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/components/ui/input-otp";
import { useAuth } from "@ui/providers/auth-provider";
import { toast } from "sonner";
import { resendAdminOtp, verifyAdminOtp } from "../_lib/actions";
import type { VerifyAdminOtpSchema } from "../_lib/validations";

export function VerifyAdminOtpForm({
  email,
  key,
  setEmail,
}: { email: string; key: string; setEmail: React.Dispatch<React.SetStateAction<string | undefined>> }) {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<VerifyAdminOtpSchema>({
    defaultValues: {
      email: email,
      otp: "",
    },
  });
  const [state, formAction] = useFormState(verifyAdminOtp, null);
  const { setUser } = useAuth();

  function handleResendOtp(email: string) {
    if (!email) {
      setEmail(undefined);
      toast.error("Session expired, please request for OTP again");
      return;
    }
    setIsLoading(true);
    toast.promise(resendAdminOtp(email, key), {
      loading: "Resending OTP",
      success: () => {
        setIsLoading(false);
        setIsResendDisabled(true);
        setCountdown(60);
        return "OTP Resent successfully";
      },
      error: (err) => {
        setIsLoading(false);
        setIsResendDisabled(true);
        setCountdown(60);
        return getErrorMessage(err);
      },
    });
  }

  function FormSubmission() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loaders.buttonLoader caption={"Verifying..."} /> : <span>Continue</span>}
      </Button>
    );
  }

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  useEffect(() => {
    if (!isResendDisabled) return;
    // Start countdown when component mounts
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval); // Clear interval when countdown reaches 0
          setIsResendDisabled(false); // Enable resend button
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  useEffect(() => {
    if (state?.user) {
      const redirectTo = searchParams.get("redirectTo") || window.location.origin;
      setUser(state.user);
      window.location.href = redirectTo;
    }
  }, [state, setUser, searchParams]);
  return (
    <Form {...form}>
      <form action={formAction} className="space-y-5">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Verify yourself</h1>
        </div>
        <input type="text" name="email" hidden defaultValue={email} />
        <input type="text" name="key" hidden defaultValue={key} />
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} className="rounded-r-md" />
                    <div className="flex w-10 justify-center items-center">
                      <div className="w-3 h-1 rounded-full bg-border" />
                    </div>
                    <InputOTPSlot index={3} className="rounded-l-md border-l" />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email <span className="text-foreground">{email}</span>.
              </FormDescription>
              <FormMessage>{state?.errors?.email || state?.errors?.otp}</FormMessage>
            </FormItem>
          )}
        />
        <FormError state={state} />
        <div className="text-muted-foreground text-xs flex items-center gap-1">
          <span>Haven't received the OTP yet?</span>
          <div>
            {isResendDisabled ? (
              <p>
                Resend OTP in <span className="text-foreground font-medium">{countdown}</span> seconds
              </p>
            ) : (
              <button
                type="button"
                className="text-foreground font-medium underline"
                onClick={() => handleResendOtp(email)}
                disabled={isLoading}
              >
                Resend
              </button>
            )}
          </div>
        </div>
        <FormSubmission />
      </form>
    </Form>
  );
}
