import { getAllUsers } from "@/api/usersApi";
import { IUser } from "@/interface/IUser";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useUserQuery = () => {
  const {
    data: users = [],
    error,
    isLoading,
    isFetched,
    refetch,
  } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: getAllUsers,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const usersMap: Map<string, IUser> = useMemo(() => {
    const map = new Map<string, IUser>();
    for (const user of users) {
      map.set(user._id, user);
    }
    return map;
  }, [users]);

  return {
    users,
    usersMap,
    error,
    isLoading,
    isFetched,
    refetch,
  };
};

export default useUserQuery;
