import React from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { toggleSidebar } from "@/app/features/common/commonSlice";
import { useLocation, useParams } from "react-router-dom";

type Props = {};

export function getCurrentPage(str) {
  const parts = str.split("/");
  const lastWord = parts[parts.length - 1];
  const converted = lastWord.replace(/-/g, " ");

  return converted;
}

const Header = (props: Props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const currentPage = getCurrentPage(location.pathname) || "";

  return (
    <div className="h-[60px]">
      <div className="h-[60px] fixed left-0 right-0 border-b border-gray-400 flex items-center justify-between px-4">
        <div>
          <h4 className="text-2xl font-bold capitalize">{currentPage}</h4>
        </div>
        <div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              dispatch(toggleSidebar());
            }}
          >
            <Menu />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
