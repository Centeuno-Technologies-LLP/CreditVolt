import { clearAuth } from "@/app/features/auth/authSlice";
import {
  selectSidebarVisible,
  toggleSidebar
} from "@/app/features/common/commonSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
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
import { auth } from "@/firebase.config";
import { resetPassword } from "@/services/firebase/auth.service";
import { Home, Lock, LogOut, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { useToast } from "../ui/use-toast";

type Props = {};

const Sidebar = (props: Props) => {
  const isSidebarVisible = useAppSelector(selectSidebarVisible);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConfirmLogoutVisible, setIsConfirmLogoutVisible] =
    React.useState(false);
  const [isConfirmResetPassword, setIsConfirmResetPassword] =
    React.useState(false);

  const options = [
    {
      icon: <Home className="mr-2 h-4 w-4" />,
      label: "Dashboard",
      onClick: (option) => {
        navigate("/dashboard");
      }
    },
    {
      icon: <User className="mr-2 h-4 w-4" />,
      label: "Profile",
      onClick: (option) => {
        navigate("/dashboard/profile");
      }
    },
    {
      icon: <Lock className="mr-2 h-4 w-4" />,
      label: "Reset password",
      onClick: (option) => {
        setIsConfirmResetPassword(true);
      }
    },
    {
      icon: <LogOut className="mr-2 h-4 w-4" />,
      label: "Logout",
      onClick: (option) => {
        setIsConfirmLogoutVisible(true);
      }
    }
  ];

  return (
    <>
      <Sheet
        open={isSidebarVisible}
        onOpenChange={() => {
          dispatch(toggleSidebar());
        }}
      >
        <SheetContent className="flex flex-col gap-2 pt-10">
          {options.map((option, key) => (
            <Button
              className="w-full justify-start"
              key={key}
              variant="outline"
              onClick={() => {
                dispatch(toggleSidebar());
                option.onClick(option);
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </Button>
          ))}
        </SheetContent>
      </Sheet>
      {/* Confirm Logout */}
      <AlertDialog
        open={isConfirmLogoutVisible}
        onOpenChange={() => {
          setIsConfirmLogoutVisible(!isConfirmLogoutVisible);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of the application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await auth.signOut();
                dispatch(clearAuth());
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await resetPassword({
                  toast,
                  dispatch
                });

                await auth.signOut();
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
