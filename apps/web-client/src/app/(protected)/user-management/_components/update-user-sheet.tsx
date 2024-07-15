"use client";

import { convertEnumToReadableFormat } from "@ui-utils/helpers";
import { type User, roles } from "@ui-utils/types";
import { toast } from "sonner";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import { Loaders } from "@ui/components/loaders";
import { Button } from "@ui/components/ui/button";
import { Form, FormControl, FormError, FormField, FormItem, FormLabel, FormMessage } from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@ui/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@ui/components/ui/sheet";
import { useCustomFormAction } from "@ui/hooks/use-custom-form-action";

import { updateUser } from "../_lib/actions";
import type { UpdateUserSchema } from "../_lib/validations";

interface UpdateUserSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  user: User;
}

export function UpdateUserSheet({ user, ...props }: UpdateUserSheetProps) {
  const form = useForm<UpdateUserSchema>({
    defaultValues: {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
  const [state, formAction] = useFormState(updateUser, null);
  const { action } = useCustomFormAction<UpdateUserSchema>(formAction);

  useEffect(() => {
    if (state?.success) {
      form.reset();
      props.onOpenChange?.(false);
      toast.success("User updated successfully");
    }
  }, [state, form, props.onOpenChange]);

  useEffect(() => {
    form.reset({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  }, [user, form]);

  function FormSubmission() {
    const { pending } = useFormStatus();
    return (
      <SheetFooter className="gap-2 pt-2 sm:space-x-0">
        <SheetClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </SheetClose>
        <Button type="submit" disabled={pending}>
          {pending ? <Loaders.buttonLoader caption={"Updating ..."} /> : <span>Update</span>}
        </Button>
      </SheetFooter>
    );
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update user</SheetTitle>
          <SheetDescription>Modify the details below to update the user.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form action={(data) => action(form, data)} className="flex flex-col gap-4">
            <input type="number" hidden name="userId" defaultValue={user.id} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.name}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@yourcompany.com" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.email}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {roles
                          .filter((value) => !["SUPER_ADMIN", "ADMIN"].includes(value))
                          .map((item) => (
                            <SelectItem key={item} value={item}>
                              {convertEnumToReadableFormat(item)}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError state={state} />
            <FormSubmission />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
