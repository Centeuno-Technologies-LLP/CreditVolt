import { setLoading } from "@/app/features/common/commonSlice";
import { useAppDispatch } from "@/app/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { auth, handleFirebaseError } from "@/firebase.config";
import { resetPassword } from "@/services/firebase/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import * as z from "zod";
import AppLogo from "../../assets/creditvolt.png";

type Props = {};

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  })
});

const resetPasswordFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email."
    })
    .min(6, {
      message: "Please enter a valid email."
    })
});

const Login = (props: Props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { toast } = useToast();
  const [isConfirmResetPassword, setIsConfirmResetPassword] =
    React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(
      setLoading({
        isLoading: true,
        message: "Logging in..."
      })
    );

    try {
      await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      ).then((userCredential) => {
        const user = userCredential.user;

        dispatch(
          setLoading({
            isLoading: false,
            message: ""
          })
        );
      });
    } catch (err) {
      if (handleFirebaseError(err) === "auth/user-not-found") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found.",
          duration: 2000
        });
      } else if (handleFirebaseError(err) === "auth/wrong-password") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Wrong password.",
          duration: 2000
        });
      } else if (handleFirebaseError(err) === "auth/too-many-requests") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Too many requests. Try again later.",
          duration: 2000
        });
      } else if (handleFirebaseError(err) === "auth/network-request-failed") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Network error. Try again later.",
          duration: 2000
        });
      }

      dispatch(
        setLoading({
          isLoading: false,
          message: ""
        })
      );
    }
  }

  async function resetPasswordOnSubmit(
    values: z.infer<typeof resetPasswordFormSchema>
  ) {
    await resetPassword(
      {
        toast,
        dispatch
      },
      values.email
    );
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="p-4">
        <div className="flex flex-col items-center justify-center mb-4">
          <img src={AppLogo} className="w-[150px] mb-4" alt="" />
          <h1 className="font-extrabold text-4xl">CreditVolt</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 bg-gray-200 rounded-lg p-4"
          >
            <h4 className="font-bold text-2xl">Login.</h4>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: john.doe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </Form>
        <h5 className="text-center text-sm font-semibold mt-2">
          Don't have an account?{" "}
          <Link to={"/auth/signup"} className="text-blue-600">
            Signup.
          </Link>
        </h5>
        <div className="flex items-center justify-center text-blue-500 text-xs">
          <Button
            variant="link"
            className="p-1"
            onClick={() => {
              setIsConfirmResetPassword(!isConfirmResetPassword);
            }}
          >
            Forgot Password?
          </Button>
        </div>
      </div>
      {/* Confirm Reset Password */}
      <AlertDialog
        open={isConfirmResetPassword}
        onOpenChange={() => {
          setIsConfirmResetPassword(!isConfirmResetPassword);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to reset your password?
            </AlertDialogTitle>
            <AlertDialogDescription>
              An email will be sent to your registered email address to reset
              your password, click on the link provided in the email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...resetPasswordForm}>
            <form
              onSubmit={resetPasswordForm.handleSubmit(resetPasswordOnSubmit)}
              className="space-y-4"
            >
              <FormField
                control={resetPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: john.doe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Send Reset Password Email
              </Button>
            </form>
          </Form>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Login;
