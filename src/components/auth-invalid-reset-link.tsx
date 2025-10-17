"use client";

import NextLink from "next/link";
import { SIGN_IN_PATH } from "@/lib/auth/constants";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function AuthInvalidResetLink() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invalid Reset Link</CardTitle>
        <CardDescription>
          The password reset link is invalid or has expired
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <NextLink href={SIGN_IN_PATH}>Back to Signin</NextLink>
        </Button>
      </CardContent>
    </Card>
  );
}
