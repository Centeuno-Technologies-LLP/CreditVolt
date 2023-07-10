import { setAuth } from "@/app/features/auth/authSlice";
import { selectLoading, setLoading } from "@/app/features/common/commonSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Loader from "@/components/common/Loader";
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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { auth, handleFirebaseError } from "@/firebase.config";
import {
  UserInfo,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type Props = {};

const AppLayout = (props: Props) => {
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handelAuthStateChange = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setLoading({
            isLoading: false,
            message: ""
          })
        );

        const userInfo: UserInfo = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          phoneNumber: auth.currentUser.phoneNumber,
          providerId: auth.currentUser.providerId
        };

        dispatch(setAuth(userInfo));

        if (location.pathname.includes("/auth")) {
          navigate("/dashboard");
        } else {
          navigate(location.pathname);
        }

        if (!auth.currentUser.emailVerified) {
          setIsEmailVerified(true);
        } else {
          setIsEmailVerified(false);
        }
      } else {
        dispatch(
          setLoading({
            isLoading: false,
            message: ""
          })
        );

        if (location.pathname.includes("/dashboard")) {
          navigate("/auth/login");
        } else {
          navigate(location.pathname);
        }
      }
    });
  };

  React.useEffect(() => {
    dispatch(
      setLoading({
        isLoading: true,
        message: "Loading..."
      })
    );

    handelAuthStateChange();
  }, [auth]);

  const handleResendEmail = async () => {
    dispatch(
      setLoading({
        isLoading: true,
        message: "Sending email..."
      })
    );

    try {
      await sendEmailVerification(auth.currentUser).then(() => {
        dispatch(
          setLoading({
            isLoading: false,
            message: ""
          })
        );

        toast({
          title: "Success",
          description: "Email sent successfully.",
          variant: "default",
          duration: 3000
        });
      });
    } catch (err) {
      if (handleFirebaseError(err) === "auth/too-many-requests") {
        toast({
          title: "Error",
          description: "Too many requests. Please try again later.",
          variant: "destructive",
          duration: 3000
        });
      } else {
        toast({
          title: "Error",
          description: "Error: " + handleFirebaseError(err),
          variant: "destructive",
          duration: 3000
        });
      }

      dispatch(
        setLoading({
          isLoading: false,
          message: ""
        })
      );
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Loader />
      <Outlet />
      <Toaster />
      {/* Verify Email Dialog */}
      {/* Verify email dialog */}
      <AlertDialog open={isEmailVerified}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Please verify your email address.
            </AlertDialogTitle>
            <AlertDialogDescription>
              We have sent you an email to verify your account. Please check
              your email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleRefresh}>
              Refresh
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResendEmail}>
              Resend Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppLayout;
