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
    }).then(() => {
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
