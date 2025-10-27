"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth/client";
import { PROFILE_PATH } from "@/lib/auth/constants";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { LoadingSwap } from "./ui/loading-swap";

type AuthProfileUpdateFormProps = {
  user: { id: string; name: string; email: string };
};

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email().min(1),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function AuthProfileUpdateForm({
  user,
}: AuthProfileUpdateFormProps) {
  const form = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  const router = useRouter();

  const { isSubmitting } = form.formState;

  const handleProfileUpdate = async (data: ProfileUpdateForm) => {
    const promises = [
      authClient.updateUser({
        name: data.name,
      }),
    ];

    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: PROFILE_PATH,
        }),
      );
    }

    const res = await Promise.all(promises);

    const updateUserResult = res[0];
    const updateEmailResult = res[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.error(
        updateUserResult.error.message || "Failed to update profile.",
      );
    } else if (updateEmailResult.error) {
      toast.error(
        updateEmailResult.error.message || "Failed to change your email.",
      );
    } else {
      if (data.email !== user.email) {
        toast.success("Verify your new email address to complete the change.");
      }
    }

    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleProfileUpdate)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
