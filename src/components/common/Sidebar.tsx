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
import { Home, LogOut, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { clearAuth } from "@/app/features/auth/authSlice";

type Props = {};

const Sidebar = (props: Props) => {
  const isSidebarVisible = useAppSelector(selectSidebarVisible);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isConfirmLogoutVisible, setIsConfirmLogoutVisible] =
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
    </>
  );
};

export default Sidebar;
