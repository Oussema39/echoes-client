import { getAllUsers } from "@/api/usersApi";
import { IUser } from "@/interface/IUser";
import { useQuery } from "@tanstack/react-query";

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
  });

  return {
    users,
    error,
    isLoading,
    isFetched,
    refetch,
  };
};

export default useUserQuery;
