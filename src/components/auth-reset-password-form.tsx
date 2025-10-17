"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth/client";
import { SIGN_IN_PATH } from "@/lib/auth/constants";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { LoadingSwap } from "./ui/loading-swap";
import { PasswordInput } from "./ui/password-input";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function AuthResetPasswordForm({ token }: { token?: string }) {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });
  const router = useRouter();
  const { isSubmitting } = form.formState;

  async function handleResetPassword(data: ResetPasswordForm) {
    await authClient.resetPassword(
      {
        ...data,
        token,
      },
      {
        onError: (error) => {
          console.error("Error during password reset:", error);
          toast.error(error.error.message || "Failed to reset password.");
        },
        onSuccess: () => {
          toast.success("Password reset successfully.");
          setTimeout(() => router.push(SIGN_IN_PATH), 1000);
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleResetPassword)}
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>Reset Password</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
