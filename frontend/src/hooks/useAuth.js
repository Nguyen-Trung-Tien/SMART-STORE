import { useSelector } from "react-redux";
import { isAdmin } from "@/lib/permissions";

export function useAuth() {
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    isAdmin: isAdmin(auth.user),
  };
}
