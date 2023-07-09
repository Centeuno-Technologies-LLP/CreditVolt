import { selectLoading, setLoading } from "@/app/features/common/commonSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as z from "zod";
import AppLogo from "../../assets/creditvolt.png";

type Props = {};

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  })
});

const Login = (props: Props) => {
  const loading = useAppSelector(selectLoading);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
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
        values.username,
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
              name="username"
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
      </div>
    </>
  );
};

export default Login;
