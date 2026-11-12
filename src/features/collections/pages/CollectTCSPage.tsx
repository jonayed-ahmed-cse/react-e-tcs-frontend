import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Search,
  ShieldCheck,
  Store,
  Wallet,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useRetailerStore } from '@/features/retailers/store/retailerStore'
import { useCollectionStore } from '@/features/collections/store/collectionStore'

const DEMO_TCS_RATE = 0.2

const currency = new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  maximumFractionDigits: 2,
})

function CollectTCSPage() {
  const navigate = useNavigate()
  const retailers = useRetailerStore((state) => state.retailers)
  const addCollection = useCollectionStore((state) => state.addCollection)

  const [search, setSearch] = useState('')
  const [selectedRetailerId, setSelectedRetailerId] = useState('')
  const [amount, setAmount] = useState('')
  const [collectionDate, setCollectionDate] = useState(
    new Date().toLocaleDateString('en-CA'),
  )
  const [paymentMethod, setPaymentMethod] = useState('Bank')
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const selectedRetailer = retailers.find(
    (retailer) => retailer.id === selectedRetailerId,
  )

  const eligibleRetailers = useMemo(
    () => retailers.filter((retailer) => retailer.status === 'Active'),
    [retailers],
  )

  const filteredRetailers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return eligibleRetailers.filter(
      (retailer) =>
        retailer.name.toLowerCase().includes(query) ||
        retailer.tin.toLowerCase().includes(query) ||
        retailer.mobile.includes(query),
    )
  }, [eligibleRetailers, search])

  const numericAmount = Number(amount)
  const validAmount = Number.isFinite(numericAmount) && numericAmount > 0
  const taxAmount = validAmount
    ? Math.round(numericAmount * DEMO_TCS_RATE) / 100
    : 0
  const totalAmount = numericAmount + taxAmount

  function handleContinue() {
    setError('')

    if (!selectedRetailer) {
      setError('Please select an active retailer.')
      return
    }

    if (!validAmount) {
      setError('Enter a valid collection amount greater than zero.')
      return
    }

    if (!collectionDate) {
      setError('Please select a collection date.')
      return
    }

    if (new Date(`${collectionDate}T00:00:00`) > new Date()) {
      setError('Collection date cannot be in the future.')
      return
    }

    setShowConfirmation(true)
  }

  function handleDemoPayment() {
    if (!selectedRetailer || !validAmount) return

    addCollection({
      retailerId: selectedRetailer.id,
      retailerName: selectedRetailer.name,
      tin: selectedRetailer.tin,
      amount: numericAmount,
      rate: DEMO_TCS_RATE,
      taxAmount,
      totalAmount,
      collectionDate,
      status: 'Pending',
    })

    navigate('/collections')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted hover:text-primary-700">
            Dashboard
          </Link>
          <span className="text-muted">/</span>
          <span className="font-semibold text-primary-700">Collect TCS</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back to dashboard"
            className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted hover:bg-background hover:text-primary-700"
          >
            <ArrowLeft size={19} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Collect TCS
            </h1>
            <p className="mt-1 text-sm text-muted">
              Select a retailer and enter collection details.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Retailer selection */}
          <section className="rounded-card border border-border/70 bg-surface shadow-sm">
            <div className="flex items-center gap-3 border-b border-border p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Store size={20} />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Select Retailer</h2>
                <p className="mt-1 text-xs text-muted">
                  Only active retailers are available.
                </p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search retailer name, TIN or mobile..."
                  aria-label="Search active retailers"
                  className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {filteredRetailers.map((retailer) => {
                  const selected = selectedRetailerId === retailer.id

                  return (
                    <button
                      key={retailer.id}
                      type="button"
                      onClick={() => setSelectedRetailerId(retailer.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600'
                          : 'border-border hover:border-primary-300 hover:bg-background'
                      }`}
                    >
                      {retailer.photoUrl ? (
                        <img
                          src={retailer.photoUrl}
                          alt=""
                          className="size-11 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                          <Store size={20} />
                        </span>
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {retailer.name}
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          TIN: {retailer.tin || 'Not provided'} · {retailer.mobile}
                        </span>
                      </span>

                      {selected && (
                        <CheckCircle2
                          size={20}
                          className="shrink-0 text-primary-700"
                        />
                      )}
                    </button>
                  )
                })}

                {filteredRetailers.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted">
                    No active retailers found.
                  </p>
                )}
              </div>

              {selectedRetailer && (
                <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                    Selected retailer
                  </p>
                  <p className="mt-2 font-bold text-foreground">
                    {selectedRetailer.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {selectedRetailer.address}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Collection information */}
          <section className="rounded-card border border-border/70 bg-surface shadow-sm">
            <div className="flex items-center gap-3 border-b border-border p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-info-soft text-info">
                <Wallet size={20} />
              </div>
              <div>
                <h2 className="font-bold text-foreground">
                  Collection Information
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Enter amount and collection date.
                </p>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Collection Amount (৳) <span className="text-danger">*</span>
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter collection amount"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label
                  htmlFor="collectionDate"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Collection Date <span className="text-danger">*</span>
                </label>
                <input
                  id="collectionDate"
                  type="date"
                  max={new Date().toLocaleDateString('en-CA')}
                  value={collectionDate}
                  onChange={(event) => setCollectionDate(event.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div>
                <label
                  htmlFor="paymentMethod"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="Bank">Bank</option>
                  <option value="Online">Online</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Calculation summary */}
        <aside className="space-y-4">
          <section className="rounded-card border border-border/70 bg-surface p-5 shadow-sm lg:sticky lg:top-20">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-success-soft text-success">
                <CircleDollarSign size={21} />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Payment Summary</h2>
                <p className="mt-1 text-xs text-muted">Automatic calculation</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted">Collection Amount</span>
                <span className="font-semibold text-foreground">
                  {currency.format(validAmount ? numericAmount : 0)}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted">
                  TCS Rate <span className="text-xs">(demo)</span>
                </span>
                <span className="font-semibold text-foreground">
                  {DEMO_TCS_RATE}%
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted">TCS Amount</span>
                <span className="font-semibold text-foreground">
                  {currency.format(taxAmount)}
                </span>
              </div>

              <div className="border-t border-dashed border-border pt-4">
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    Total Payable
                  </span>
                  <span className="text-xl font-bold text-primary-700">
                    {currency.format(validAmount ? totalAmount : 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-background p-3">
              <p className="text-xs leading-5 text-muted">
                The displayed TCS rate is a demonstration value. Confirm the
                applicable legal rate and calculation rules before production use.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              <CreditCard size={18} />
              Continue to Payment
            </button>
          </section>

          <div className="flex gap-3 rounded-xl border border-border bg-surface p-4">
            <ShieldCheck size={20} className="shrink-0 text-success" />
            <p className="text-xs leading-5 text-muted">
              Demo mode: no real payment or bank transaction will be processed.
            </p>
          </div>
        </aside>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Demo payment confirmation */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirmation(false)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-dialog-title"
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl"
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <CreditCard size={27} />
            </div>

            <h2
              id="payment-dialog-title"
              className="mt-4 text-center text-xl font-bold text-foreground"
            >
              Confirm Demo Collection
            </h2>
            <p className="mt-2 text-center text-sm text-muted">
              Review the details before creating this demo collection record.
            </p>

            <div className="mt-5 space-y-3 rounded-xl bg-background p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted">Retailer</span>
                <span className="text-right font-semibold text-foreground">
                  {selectedRetailer?.name}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">Payment Method</span>
                <span className="font-semibold text-foreground">
                  {paymentMethod}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">Total Amount</span>
                <span className="font-bold text-primary-700">
                  {currency.format(totalAmount)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-muted">
              This action creates a Pending demo record. It does not process
              payment or confirm a deposit.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="h-11 flex-1 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-background"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleDemoPayment}
                className="h-11 flex-1 rounded-xl bg-primary-700 px-4 text-sm font-semibold text-white hover:bg-primary-600"
              >
                Create Demo Record
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default CollectTCSPage
