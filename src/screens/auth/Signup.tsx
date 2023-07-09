import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import AppLogo from "../../assets/creditvolt.png";
import { Helmet } from "react-helmet-async";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, handleFirebaseError } from "@/firebase.config";
import { selectLoading, setLoading } from "@/app/features/common/commonSlice";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useToast } from "@/components/ui/use-toast";

type Props = {};

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email."
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters."
    }),
    confirmPassword: z.string()
  })
  .required()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

const Signup = (props: Props) => {
  const loading = useAppSelector(selectLoading);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(
      setLoading({
        isLoading: true,
        message: "Creating account..."
      })
    );

    try {
      await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      ).then((userCredential) => {
        const user = userCredential.user;

        dispatch(
          setLoading({
            isLoading: false,
            message: "Creating account..."
          })
        );
      });
    } catch (err) {
      if (handleFirebaseError(err) === "auth/email-already-in-use") {
        toast({
          title: "Email already in use.",
          description: "Please try another email.",
          variant: "destructive",
          duration: 2000
        });
      }

      dispatch(
        setLoading({
          isLoading: false,
          message: "Creating account..."
        })
      );
    }
  }

  return (
    <>
      <Helmet>
        <title>Signup</title>
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
            <h4 className="font-bold text-2xl">Create an account.</h4>
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Signup
            </Button>
          </form>
        </Form>
        <h5 className="text-center text-sm font-semibold mt-2">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="text-blue-600">
            Login.
          </Link>
        </h5>
      </div>
    </>
  );
};

export default Signup;
