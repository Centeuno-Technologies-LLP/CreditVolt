import { setAuth } from "@/app/features/auth/authSlice";
import { selectLoading, setLoading } from "@/app/features/common/commonSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import Loader from "@/components/common/Loader";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/firebase.config";
import { UserInfo, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type Props = {};

const AppLayout = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

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

  return (
    <>
      <Loader />
      <Outlet />
      <Toaster />
    </>
  );
};

export default AppLayout;
