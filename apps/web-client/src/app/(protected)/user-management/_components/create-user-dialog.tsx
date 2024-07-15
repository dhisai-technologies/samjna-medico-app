"use client";

import { convertEnumToReadableFormat } from "@ui-utils/helpers";
import { roles } from "@ui-utils/types";
import { toast } from "sonner";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import { Loaders } from "@ui/components/loaders";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Form, FormControl, FormError, FormField, FormItem, FormLabel, FormMessage } from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/components/ui/select";
import { useCustomFormAction } from "@ui/hooks/use-custom-form-action";

import { createUser } from "../_lib/actions";
import type { CreateUserSchema } from "../_lib/validations";

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateUserSchema>({
    defaultValues: {
      name: "",
      email: "",
      role: "EMPLOYEE",
    },
  });

  const [state, formAction] = useFormState(createUser, null);
  const { action } = useCustomFormAction<CreateUserSchema>(formAction);

  function FormSubmission() {
    const { pending } = useFormStatus();
    return (
      <DialogFooter className="gap-2 pt-2 sm:space-x-0 w-full">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? <Loaders.buttonLoader caption={"Creating ..."} /> : <span>Create</span>}
        </Button>
      </DialogFooter>
    );
  }

  useEffect(() => {
    if (state?.success) {
      form.reset();
      toast.success("User created successfully");
      setOpen(false);
    }
  }, [state, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          New user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>Fill in the details below to create a new user.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={(data) => action(form, data)} className="flex flex-col gap-4">
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
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles
                        .filter((value) => !["SUPER_ADMIN", "ADMIN"].includes(value))
                        .map((item) => (
                          <SelectItem key={item} value={item}>
                            {convertEnumToReadableFormat(item)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage>{state?.errors?.role}</FormMessage>
                </FormItem>
              )}
            />
            <FormError state={state} />
            <FormSubmission />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
