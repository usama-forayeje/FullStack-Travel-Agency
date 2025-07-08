import { Header } from "~/components";
import { cn } from "lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
import { formatDateTime } from "~/lib/utils";

export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);

  return { users, total };
};

const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <img
            src={user.imageUrl}
            alt={user.name}
            className="size-8 aspect-square rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="font-medium text-gray-800">{user.name}</span>
        </div>
      );
    },
    size: 200,
    minSize: 150,
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.email}</span>
    ),
    size: 250,
  },
  {
    accessorKey: "dateJoined",
    header: "Joined Date",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
        {formatDateTime(row.original.joinedAt)}
      </span>
    ),
    size: 150,
  },
  {
    accessorKey: "interests",
    header: () => <div className="text-center">Trips Created</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm text-gray-600 ">
          {row.original.itineraryCreated || 0}
        </span>
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const isUser = status === "user";
      return (
        <div className="flex justify-center">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
              isUser
                ? "bg-emerald-100 text-emerald-800"
                : "bg-indigo-100 text-indigo-800"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isUser ? "bg-emerald-500" : "bg-indigo-500"
              )}
            ></span>
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
        </div>
      );
    },
    size: 100,
  },
];

function AllUsers({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;

  const table = useReactTable({
    data: users,

    columns,
    getCoreRowModel: getCoreRowModel(),
    // চাইলে এখানে অন্যান্য ফিচার যেমন pagination, sorting, filtering যোগ করতে পারেন:
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    // state: {
    //   pagination, // যদি pagination ব্যবহার করেন
    //   sorting, // যদি sorting ব্যবহার করেন
    //   globalFilter, // যদি global filtering ব্যবহার করেন
    // },
    // onPaginationChange: setPagination,
    // onSortingChange: setSorting,
    // onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <main className="dashboard wrapper p-6 lg:p-8">
      <Header
        title="Manage Users"
        description="Filter, sort, and access detailed user information."
      />
      {/* ডেটা টেবিল */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-4 text-sm text-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (যদি ব্যবহার করেন) */}
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
    </main>
  );
}

export default AllUsers;
