import React from "react";
import { Helmet } from "react-helmet-async";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectAuthData } from "@/app/features/auth/authSlice";
import { updateUserInfo } from "@/services/firebase/auth.service";
import { useToast } from "@/components/ui/use-toast";
import { setLoading } from "@/app/features/common/commonSlice";

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters."
  }),
  email: z.string(),
  phoneNumber: z.string(),
  photoURL: z.string()
});

type Props = {};

const Profile = (props: Props) => {
  const currentUser = useAppSelector(selectAuthData);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      phoneNumber: "",
      photoURL: ""
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(
      setLoading({
        loading: true,
        message: "Updating user info..."
      })
    );

    await updateUserInfo(values.displayName, {
      dispatch,
      toast
    });
  }

  React.useEffect(() => {
    form.reset({
      displayName: currentUser.displayName || "",
      email: currentUser.email || "",
      phoneNumber: currentUser.phoneNumber || "",
      photoURL: currentUser.photoURL || ""
    });
  }, [currentUser]);

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photoURL"
              render={({ field }) => (
                <div className="relative">
                  <FormItem className="absolute left-0 right-0 bottom-0 top-0 opacity-0">
                    <FormControl>
                      <Input placeholder="Photo URL" {...field} type="file" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  {currentUser.photoURL && (
                    <img
                      src={currentUser.photoURL}
                      alt="profile"
                      className="h-[100px] w-[100px] rounded-full"
                    />
                  )}
                  {!currentUser.photoURL && (
                    <div className="h-[100px] w-[100px] rounded-full bg-gray-500 flex items-center justify-center">
                      <h2 className="text-4xl font-extrabold text-white">
                        {currentUser.displayName?.split("")[0]}
                      </h2>
                    </div>
                  )}
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Display Name" {...field} />
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
                    <Input disabled placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Profile;
