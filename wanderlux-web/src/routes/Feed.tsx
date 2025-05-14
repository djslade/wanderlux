import { useUser } from "../hooks/useUser";

export const Feed = () => {
  const { user, fetched } = useUser();

  if (!fetched) return "Loading...";

  if (!user) return "wow";

  console.log(typeof user.created);

  console.log(user);
  return (
    <div>
      <h1>Hi from Feed</h1>
      <h1>User Id: {user.id}</h1>
    </div>
  );
};
