import {
  AppLayout,
  AuthLayout,
  DashboardLayout
} from "@/layouts/default-exports";
import { Navigate, Route, Routes } from "react-router-dom";
import Profile from "./dashboard/Profile";
import {
  ForgotPassword,
  Home,
  Login,
  ResetPassword,
  Signup
} from "./default-exports";

type Props = {};

const Router = (props: Props) => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={"/auth/login"} />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to={"/auth/login"} />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <div>
            <h1>Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default Router;
