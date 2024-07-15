"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import { Loaders } from "@ui/components/loaders";
import { Button } from "@ui/components/ui/button";
import { Form, FormError } from "@ui/components/ui/form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { requestUserOtp } from "../_lib/actions";
import type { RequestUserOtpSchema } from "../_lib/validations";
import { VerifyUserOtpForm } from "./verify-user-otp-form";

export function LoginUserForm() {
  const form = useForm<RequestUserOtpSchema>({
    defaultValues: {
      email: "",
    },
  });
  const [state, formAction] = useFormState(requestUserOtp, null);
  const [email, setEmail] = useState<string>();

  function FormSubmission() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loaders.buttonLoader caption={"Requesting OTP..."} /> : <span>Continue</span>}
      </Button>
    );
  }

  useEffect(() => {
    if (state?.success) {
      setEmail(form.getValues().email);
    }
  }, [state, form]);
  return (
    <>
      {!email ? (
        <Form {...form}>
          <form action={formAction} className="space-y-5 w-full">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Login as User</h1>
              <p className="text-sm text-muted-foreground">Enter your email below to request for OTP</p>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@samjna.co" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.email}</FormMessage>
                </FormItem>
              )}
            />
            <FormError state={state} />
            <FormSubmission />
          </form>
        </Form>
      ) : (
        <VerifyUserOtpForm email={email} setEmail={setEmail} />
      )}
    </>
  );
}
