import { Outlet, redirect } from "react-router";
import { MobileSidebar, NavItems } from "~/components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";

export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user?.$id) {
      console.log(
        "AdminLayout clientLoader: No Appwrite session. Redirecting to /sign-in."
      );
      return redirect("/sign-in");
    }

    const existingUser = await getExistingUser(user.$id);

    if (!existingUser) {
      console.log(
        "AdminLayout clientLoader: No existing user data found. Attempting to store."
      );
      const createdUser = await storeUserData();
      if (createdUser?.status === "user") {
        console.log(
          "AdminLayout clientLoader: Newly stored user is a regular user. Redirecting to /."
        );
        return redirect("/");
      }
      return createdUser;
    }

    if (existingUser.status === "user") {
      console.log(
        "AdminLayout clientLoader: Existing user is a regular user. Redirecting to /."
      );
      return redirect("/");
    }

    return existingUser;
  } catch (error) {
    console.error(
      "AdminLayout clientLoader: Uncaught error during user or data fetch, redirecting:",
      error
    );
    return redirect("/sign-in");
  }
}

function AdminLayout() {
  return (
    <div className="admin-layout">
      <MobileSidebar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}

export default AdminLayout;
