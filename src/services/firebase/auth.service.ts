import { setAuth } from "@/app/features/auth/authSlice";
import { setLoading } from "@/app/features/common/commonSlice";
import { auth, handleFirebaseError } from "@/firebase.config";
import { UserInfo, updateProfile } from "firebase/auth";

export const updateUserInfo = async (
  displayName: Partial<UserInfo["displayName"]>,
  utilities
) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName
    }).then((user) => {
      utilities?.toast({
        variant: "default",
        title: "Success",
        description: "User info updated successfully!",
        duration: 2000
      });

      utilities?.dispatch(
        setLoading({
          loading: false,
          message: ""
        })
      );

      utilities?.dispatch(
        setAuth({
          displayName: auth.currentUser?.displayName,
          email: auth.currentUser?.email,
          phoneNumber: auth.currentUser?.phoneNumber,
          photoURL: auth.currentUser?.photoURL,
          providerId: auth.currentUser?.providerId,
          uid: auth.currentUser?.uid
        })
      );
    });
  } catch (err) {
    utilities?.toast({
      variant: "destructive",
      title: "Error",
      description: err?.message,
      duration: 2000
    });

    utilities?.dispatch(
      setLoading({
        loading: false,
        message: ""
      })
    );
  }
};
