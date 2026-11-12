import { useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  CalendarDays,
  ClipboardList,
  Search,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useCollectionStore } from '@/features/collections/store/collectionStore'

const currency = new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  maximumFractionDigits: 2,
})

type StatusFilter = 'All Status' | 'Paid' | 'Pending' | 'Failed'

function CollectionsPage() {
  const collections = useCollectionStore((state) => state.collections)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Status')

  const filteredCollections = useMemo(() => {
    const query = search.trim().toLowerCase()

    return collections.filter((item) => {
      const matchesSearch =
        !query ||
        item.retailerName.toLowerCase().includes(query) ||
        item.tin.toLowerCase().includes(query) ||
        item.reference.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'All Status' || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [collections, search, statusFilter])

  const totalAmount = collections.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  )
  const paidCount = collections.filter((item) => item.status === 'Paid').length
  const pendingCount = collections.filter(
    (item) => item.status === 'Pending',
  ).length

  const summary = [
    {
      label: 'Total Transactions',
      value: collections.length,
      icon: ClipboardList,
      iconClass: 'bg-primary-50 text-primary-700',
    },
    {
      label: 'Total Collection',
      value: currency.format(totalAmount),
      icon: Wallet,
      iconClass: 'bg-info-soft text-info',
    },
    {
      label: 'Paid / Pending',
      value: `${paidCount} / ${pendingCount}`,
      icon: CalendarDays,
      iconClass: 'bg-success-soft text-success',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted hover:text-primary-700">
              Dashboard
            </Link>
            <span className="text-muted">/</span>
            <span className="font-semibold text-primary-700">Collections</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Collection History
          </h1>
          <p className="mt-1 text-sm text-muted">
            View and search TCS collection records.
          </p>
        </div>

        <Link
          to="/collect-tcs"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <Wallet size={18} /> New Collection
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon

          return (
            <article
              key={item.label}
              className="flex items-center justify-between rounded-card border border-border/70 bg-surface p-5 shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-2 truncate text-xl font-bold text-foreground">
                  {item.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${item.iconClass}`}>
                <Icon size={22} />
              </div>
            </article>
          )
        })}
      </section>

      <section className="overflow-hidden rounded-card border border-border/70 bg-surface shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              All Transactions
            </h2>
            <p className="mt-1 text-sm text-muted">
              {filteredCollections.length} of {collections.length} records
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:w-72">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search retailer or reference..."
                aria-label="Search collections"
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              aria-label="Filter collection status"
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            >
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-background text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">Reference</th>
                <th className="px-5 py-4 font-semibold">Retailer</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Collection</th>
                <th className="px-5 py-4 font-semibold">TCS</th>
                <th className="px-5 py-4 font-semibold">Total</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCollections.map((item) => (
                <tr key={item.id} className="hover:bg-background/70">
                  <td className="px-5 py-4 font-semibold text-primary-700">
                    {item.reference}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {item.retailerName}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      TIN: {item.tin || 'Not provided'}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {item.collectionDate}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {currency.format(item.amount)}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {currency.format(item.taxAmount)}
                  </td>
                  <td className="px-5 py-4 font-bold text-foreground">
                    {currency.format(item.totalAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'Paid'
                          ? 'bg-success-soft text-success'
                          : item.status === 'Failed'
                            ? 'bg-danger-soft text-danger'
                            : 'bg-warning-soft text-warning'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border md:hidden">
          {filteredCollections.map((item) => (
            <article key={item.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {item.retailerName}
                  </h3>
                  <p className="mt-1 text-xs text-primary-700">
                    {item.reference}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-xs text-muted">
                <span>{item.collectionDate}</span>
                <span className="font-bold text-foreground">
                  {currency.format(item.totalAmount)}
                </span>
              </div>
              <p className="text-xs text-muted">
                Collection: {currency.format(item.amount)} · TCS:{' '}
                {currency.format(item.taxAmount)}
              </p>
            </article>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="px-5 py-12 text-center">
            <ArrowDownToLine size={25} className="mx-auto text-muted" />
            <h3 className="mt-3 font-semibold text-foreground">
              No collections found
            </h3>
            <p className="mt-1 text-sm text-muted">
              Create a collection or change your search filters.
            </p>
            {collections.length === 0 && (
              <Link
                to="/collect-tcs"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700"
              >
                <Wallet size={16} /> Create first collection
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default CollectionsPage
