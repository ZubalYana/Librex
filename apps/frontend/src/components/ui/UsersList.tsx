import { useState, useEffect } from "react";
import { apiFetch } from "../../api/apiFetch";
import type { User } from "../../store/authStore";
import { useAlertStore } from "../../store/alertStore";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "./popups/ConfirmDialog";
import { useAuthStore } from "../../store/authStore";
import { Button } from "./Button";

export default function UsersList() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [roleChangingUser, setRoleChangingUser] = useState<User | null>(null);
  const thisUser = useAuthStore((state) => state.user);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    userLimit: 15,
    totalCount: 0,
    totalPages: 0,
  });
  const setAlert = useAlertStore((state) => state.setAlert);

  useEffect(() => {
    apiFetch(
      `/admin/users?page=${usersPagination.page}&limit=${usersPagination.userLimit}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setUsersPagination(data.pagination);
      })
      .catch((err) => {
        setAlert("error", "Error fetching users");
        console.error(err);
      });
  }, [usersPagination.page]);

  const deleteUser = () => {
    if (!deletingUser) return;
    apiFetch(`/admin/users/${deletingUser.id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setAlert("success", `Deleted ${deletingUser.email} successfully`);
        setUsers(
          (prev) => prev?.filter((u) => u.id !== deletingUser.id) ?? null
        );
        setDeletingUser(null);
      })
      .catch((err) => {
        setAlert("error", err.message);
        setDeletingUser(null);
      });
  };

  const makeAdmin = () => {
    if (!roleChangingUser) return;

    // const previousUsers = users;
    const newRole = roleChangingUser.role === "USER" ? "ADMIN" : "USER";

    apiFetch(`/admin/users/${roleChangingUser.id}/role`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        setAlert("success", `${roleChangingUser.email} is now ${newRole}`);
        setUsers(
          (prev) =>
            prev?.map((u) => (u.id === data.user.id ? data.user : u)) ?? null
        );
        setRoleChangingUser(null);
      })
      .catch((err) => {
        console.error(err);
        setAlert("error", err.message);
        setRoleChangingUser(null);
      });
  };

  if (!users) {
    return <div className="text-sm text-ink/50 font-sans">Loading...</div>;
  }

  return (
    <div className="w-full">
      {users.length === 0 ? (
        <div className="text-sm text-ink/50 font-sans">No users yet</div>
      ) : (
        <div className="w-full flex flex-col gap-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className={`rounded-lg flex items-center justify-between w-full py-3 px-4 border transition-colors ${
                user.id === thisUser?.id
                  ? "bg-accent/10 border-accent/30"
                  : "bg-white/40 border-ink/10 hover:bg-white/60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center shrink-0 font-serif text-sm font-semibold text-navy">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {user.name}
                    {user.id === thisUser?.id && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-accent font-semibold">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink/50 truncate">{user.email}</p>
                </div>
              </div>

              {user.id !== thisUser?.id && (
                <div className="flex items-center gap-3">
                  <select
                    value={user.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      if (newRole === user.role) return;
                      setRoleChangingUser(user);
                    }}
                    className="h-8 rounded-md border border-ink/20 bg-parchment px-2 text-xs font-sans text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={() => setDeletingUser(user)}
                    aria-label={`Delete ${user.email}`}
                    className="cursor-pointer p-2 rounded-full text-ink/40 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {usersPagination.totalPages > 1 && (
        <div className="w-full flex items-center justify-center gap-3 mt-6">
          <Button
            variant="secondary"
            size="sm"
            disabled={usersPagination.page <= 1}
            onClick={() =>
              setUsersPagination((p) => ({ ...p, page: p.page - 1 }))
            }
          >
            Previous
          </Button>
          <span className="text-sm text-ink/60">
            Page {usersPagination.page} of {usersPagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={usersPagination.page >= usersPagination.totalPages}
            onClick={() =>
              setUsersPagination((p) => ({ ...p, page: p.page + 1 }))
            }
          >
            Next
          </Button>
        </div>
      )}

      {deletingUser && (
        <ConfirmDialog
          open={true}
          onCancel={() => setDeletingUser(null)}
          title={`Delete ${deletingUser.email}?`}
          description="This action cannot be undone."
          onConfirm={deleteUser}
        />
      )}
      {roleChangingUser && (
        <ConfirmDialog
          open={true}
          onCancel={() => setRoleChangingUser(null)}
          title={
            roleChangingUser.role === "USER"
              ? `Make ${roleChangingUser.email} an admin?`
              : `Remove admin access from ${roleChangingUser.email}?`
          }
          description={
            roleChangingUser.role === "USER"
              ? "They'll gain full admin permissions across Librex."
              : "They'll lose admin permissions and be treated as a regular user."
          }
          onConfirm={makeAdmin}
          confirmLabel="Change role"
        />
      )}
    </div>
  );
}
