"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";

import { cn } from "@/lib/utils";

import { AuthProps } from "@/models/interfaces/auth";

import { FrontendRoutesEnum } from "@/models/enums/frontend-routes";
import { AuthSignInSchema, AuthSignInSchemaType } from "@/models/schemas/auth";

export function SignInForm({ className, translation, ...props }: AuthProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof AuthSignInSchema>>({
    resolver: zodResolver(AuthSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AuthSignInSchemaType> = async (data) => {
    const validatedCredentials = AuthSignInSchema.parse(data);

    if (!validatedCredentials) {
      return;
    }

    setLoading(true);

    const signInPromise = new Promise((resolve, reject) => {
      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
        .then((result) => {
          if (result?.error) {
            reject(result.code);
          }

          resolve(result);
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });

    toast.promise(signInPromise, {
      loading: translation?.generic.loading,
      success: () => {
        router.push(FrontendRoutesEnum.DASHBOARD_SEARCH);
        return translation?.success.signInSuccess;
      },
      error: (error: string) => {
        if (error === "Sign-in failed") {
          return translation?.errors.signInFailed;
        }

        return translation?.errors.failedRequest;
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {translation?.authentication.signIn}
          </CardTitle>
          <CardDescription>
            {translation?.authentication.subtitleSignIn}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation?.authentication.email}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translation?.placeholder.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <section className="flex items-center justify-between">
                      <FormLabel>
                        {translation?.authentication.password}
                      </FormLabel>
                      <Link href={FrontendRoutesEnum.FORGOT_PASSWORD}>
                        <FormDescription className="text-right">
                          {translation?.authentication.forgotPassword}
                        </FormDescription>
                      </Link>
                    </section>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={translation?.placeholder.password}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  translation?.authentication.submit
                )}
              </Button>

              <div className="text-center text-sm">
                {translation?.authentication.dontHaveAccount}{" "}
                <Link
                  href={FrontendRoutesEnum.SIGN_UP}
                  className="underline underline-offset-4"
                >
                  {translation?.authentication.createAccount}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {translation?.authentication.welcomeMessage}
      </div>
    </div>
  );
}
