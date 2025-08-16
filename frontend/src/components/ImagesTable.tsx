import * as React from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import Button from './Button';
import { Image } from '../types';

interface ImagesTableProps {
  images: Image[];
  onView: (image: Image) => void;
  onPull: (image: Image) => void;
  onDelete: (image: Image) => void;
}

const ImagesTable: React.FC<ImagesTableProps> = ({ images, onView, onPull, onDelete }) => {
  const columns: ColumnDef<Image>[] = React.useMemo(
    () => [
      {
        header: 'Image Name',
        accessorKey: 'name',
      },
      {
        header: 'Tags',
        accessorKey: 'tags',
        cell: ({ getValue }) => {
          const value = getValue<string[]>();
          return (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge badge-outline badge-sm">
                  {tag}
                </span>
              ))}
              {value.length > 3 && (
                <span className="badge badge-ghost badge-sm">+{value.length - 3} more</span>
              )}
            </div>
          );
        },
      },
      {
        header: 'Last Modified',
        accessorKey: 'lastModified',
        cell: ({ getValue }) => {
          const value = getValue<string | null>();
          return (
            <span className="text-sm text-base-content/70">
              {value ? new Date(value).toLocaleDateString() : 'Unknown'}
            </span>
          );
        },
      },
      {
        header: 'Size',
        accessorKey: 'size',
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return <span className="text-sm text-base-content/70">{value}</span>;
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button size="xs" variant="outline" onClick={() => onView(row.original)}>
              View
            </Button>
            <Button size="xs" variant="ghost" onClick={() => onPull(row.original)}>
              Pull
            </Button>
            <Button size="xs" variant="error" onClick={() => onDelete(row.original)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [onView, onPull, onDelete]
  );

  const table = useReactTable({
    data: images,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-base-300">
        <h3 className="text-lg font-semibold text-base-content">Docker Images</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-4">
        <Button size="sm" variant="outline" onClick={table.previousPage} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button size="sm" variant="outline" onClick={table.nextPage} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ImagesTable);
