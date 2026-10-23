import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteResource } from "@/app/admin/resources/actions";
import { requireAdmin } from "@/lib/admin/guard";
import { listAdminResources } from "@/lib/resources-repo";

export default async function AdminResourcesListPage() {
  await requireAdmin();

  const rows = await listAdminResources();

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Resources"
        description="Create, edit, and publish SDC library resources."
      />
      <Container className="py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <SectionHeading eyebrow="Resources" title="All resources" />
          <div className="flex gap-2">
            <Button href="/admin/resources/new" size="sm">
              Create resource
            </Button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No resources yet"
              description="Create your first resource to get started."
              action={
                <a href="/admin/resources/new" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
                  Create resource
                </a>
              }
            />
          </div>
        ) : null}

        {rows.length > 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 text-slate-900 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Resource</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Published</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/resources/${row.id}/edit`}>
                        {row.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{row.type}</td>
                    <td className="px-6 py-4">
                      {row.category ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      {row.is_published ? (
                        <Badge tone="green">Published</Badge>
                      ) : (
                        <Badge tone="slate">Draft</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/resources/${row.id}/edit`}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        Edit
                      </Link>
                      <form action={deleteResource} className="inline">
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="ml-3 text-sm font-medium text-red-600 hover:text-red-800"
                          onClick={(e) => {
                            if (
                              !window.confirm(
                                `Delete “${row.title}”? This cannot be undone.`,
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Container>
    </>
  );
}
