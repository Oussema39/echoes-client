import { useState, useMemo } from "react";
import { Autocomplete } from "../ui/autocomplete";
import useUserQuery from "@/hooks/users/useUserQuery";

const UsersInput = () => {
  const { users, isLoading } = useUserQuery();
  const [value, setValues] = useState<string[]>([]);

  const options = useMemo(() => {
    return users?.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.email,
    }));
  }, [users]);

  return (
    <Autocomplete
      options={options}
      onSelectionChange={setValues}
      selectedValues={value}
      placeholder="Search users..."
      loading
    />
  );
};

export default UsersInput;
