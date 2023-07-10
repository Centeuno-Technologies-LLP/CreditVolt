import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { Outlet } from "react-router-dom";

type Props = {};

const DashboardLayout = (props: Props) => {
  return (
    <>
      <Header />
      <div className="p-4">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
