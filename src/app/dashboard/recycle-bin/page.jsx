"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Trash2,
  RotateCcw,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const loginData = localStorage.getItem('userData');
    if (loginData) {
      const parsed = JSON.parse(loginData);
      return parsed.accessToken;
    }
  }
  return null;
};

export default function RecycleBin() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("deletedAt");
  const [sortDir, setSortDir] = useState("desc");

  const [selected, setSelected] = useState(new Set());

  const abortRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => i?.category && set.add(i.category));
    return ["all", ...Array.from(set).sort((a, b) => String(a).localeCompare(String(b)))];
  }, [items]);

  const visibleIds = useMemo(
    () => items.map((i) => i?.id || i?._id).filter(Boolean),
    [items]
  );
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));

  const applySelectAllVisible = (checked) => {
    const next = new Set(selected);
    if (checked) {
      visibleIds.forEach((id) => next.add(id));
    } else {
      visibleIds.forEach((id) => next.delete(id));
    }
    setSelected(next);
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const fetchDeletedExpenses = async (opts = {}) => {
    const { signal } = opts;
    setLoading(true);
    setError("");
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        sortBy,
        sortDir
      });
      
      if (searchTerm) params.append('q', searchTerm);
      if (category !== "all") params.append('category', category);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/expenses/deleted?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : { message: 'Unknown error' };
        } catch {
          errorData = { message: errorText || 'Failed to fetch deleted expenses' };
        }
        throw new Error(errorData.message);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setItems(data);
        setTotal(data.length);
        setPages(Math.max(1, Math.ceil(data.length / pageSize)));
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setItems(data.slice(start, end));
      } else {
        const items = data?.items ?? [];
        setItems(items);
        setTotal(data?.total ?? items.length);
        setPages(
          data?.pages ?? Math.max(1, Math.ceil((data?.total ?? items.length) / (data?.pageSize ?? pageSize)))
        );
        if (typeof data?.page === "number") setPage(data.page);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err?.message || "Failed to load deleted expenses");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchDeletedExpenses({ signal: controller.signal });
    }, 300);

    return () => {
      controller.abort();
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [page, pageSize, searchTerm, category, startDate, endDate, sortBy, sortDir]);

  const refresh = () => {
    fetchDeletedExpenses();
  };

  const confirm = async ({ title, text, confirmText = "Confirm", confirmColor = "#2563eb", icon = "warning" }) => {
    const res = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      confirmButtonColor: confirmColor,
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });
    return res.isConfirmed;
  };

  const restoreExpenses = async (ids) => {
    if (!ids?.length) return;
    const ok = await confirm({
      title: "Restore expenses",
      text: `Restore ${ids.length} item${ids.length > 1 ? "s" : ""} back to Expenses?`,
      confirmText: "Restore",
      confirmColor: "#16a34a",
      icon: "question",
    });
    if (!ok) return;

    try {
      const token = getAuthToken();
      const response = await fetch('/api/expenses/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : { message: 'Unknown error' };
        } catch {
          errorData = { message: errorText || 'Failed to restore expenses' };
        }
        throw new Error(errorData.message);
      }

      toast.success("Expenses restored");
      setSelected(new Set());
      refresh();
    } catch (err) {
      toast.error(err?.message || "Failed to restore");
    }
  };

  const deleteForever = async (ids) => {
    if (!ids?.length) return;
    const ok = await confirm({
      title: "Permanently delete",
      text: `This will permanently remove ${ids.length} item${ids.length > 1 ? "s" : ""}. This action cannot be undone.`,
      confirmText: "Delete forever",
      confirmColor: "#dc2626",
      icon: "warning",
    });
    if (!ok) return;

    try {
      const token = getAuthToken();
      const response = await fetch('/api/expenses/hard-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : { message: 'Unknown error' };
        } catch {
          errorData = { message: errorText || 'Failed to delete expenses' };
        }
        throw new Error(errorData.message);
      }

      toast.success("Expenses permanently deleted");
      setSelected(new Set());
      refresh();
    } catch (err) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  const onHeaderSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, category, startDate, endDate]);

  const EmptyState = () => (
    <div className="text-center py-16 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 border border-white/10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
        <Trash2 className="h-6 w-6 text-slate-200" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">No deleted expenses</h3>
      <p className="mt-1 text-slate-300">
        Deleted items stay here for 24 hours before they are removed automatically. You can restore them or delete them permanently anytime during that window.
      </p>
      <button
        type="button"
        onClick={refresh}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-150 p-4 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-6 text-white shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">Recycle Bin</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Deleted expenses stay here for 24 hours before they are removed automatically. You can restore or permanently delete them during that window.
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex flex-col items-start gap-3 rounded-[1.25rem] border border-red-200 bg-red-50 p-4 text-red-700 md:flex-row md:items-center">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Failed to load</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search description or notes..."
              className="w-full rounded-2xl border border-transparent bg-slate-900/90 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <select
              className="w-full cursor-pointer appearance-none rounded-2xl border border-transparent bg-slate-900/90 py-2.5 pl-10 pr-9 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="date"
              className="w-full cursor-pointer rounded-2xl border border-transparent bg-slate-900/90 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="date"
              className="w-full cursor-pointer rounded-2xl border border-transparent bg-slate-900/90 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCategory("all");
                setStartDate("");
                setEndDate("");
                setSortBy("deletedAt");
                setSortDir("desc");
                setPage(1);
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              title="Reset filters"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={refresh}
              className="rounded-2xl bg-blue-600 px-3 py-2.5 text-white transition hover:bg-blue-700"
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="mb-3 flex flex-col flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-cyan-400/30 bg-blue-950/80 px-3 py-2.5 sm:flex-row">
            <div className="text-sm text-slate-100">{selected.size} selected</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => restoreExpenses(Array.from(selected))}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <RotateCcw className="h-4 w-4" />
                Restore
              </button>
              <button
                type="button"
                onClick={() => deleteForever(Array.from(selected))}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete forever
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 bg-slate-900/80"
                      checked={allVisibleSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = !allVisibleSelected && someVisibleSelected;
                      }}
                      onChange={(e) => applySelectAllVisible(e.target.checked)}
                    />
                  </th>
                  <Th label="Date" sortKey="date" sortBy={sortBy} sortDir={sortDir} onSort={onHeaderSort} />
                  <Th label="Category" sortKey="category" sortBy={sortBy} sortDir={sortDir} onSort={onHeaderSort} />
                  <Th label="Description" sortKey="description" sortBy={sortBy} sortDir={sortDir} onSort={onHeaderSort} />
                  <Th label="Amount" sortKey="amount" sortBy={sortBy} sortDir={sortDir} onSort={onHeaderSort} align="right" />
                  <Th label="Deleted on" sortKey="deletedAt" sortBy={sortBy} sortDir={sortDir} onSort={onHeaderSort} />
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {loading &&
                  Array.from({ length: Math.min(5, pageSize) }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="animate-pulse">
                      <td className="px-4 py-4"><div className="h-4 w-4 rounded bg-white/20" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 rounded bg-white/20" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 rounded bg-white/20" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-48 rounded bg-white/20" /></td>
                      <td className="px-4 py-4 text-right"><div className="ml-auto h-4 w-16 rounded bg-white/20" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-28 rounded bg-white/20" /></td>
                      <td className="px-4 py-4 text-right"><div className="ml-auto h-8 w-28 rounded bg-white/20" /></td>
                    </tr>
                  ))}

                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8">
                      <EmptyState />
                    </td>
                  </tr>
                )}

                {!loading &&
                  items.map((item) => {
                    const id = item?.id || item?._id || item?.ID || item?.Id;
                    const checked = id ? selected.has(id) : false;
                    return (
                      <tr key={id || Math.random()}>
                        <td className="px-4 py-3">
                          {id ? (
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 bg-slate-900/80"
                              checked={checked}
                              onChange={() => toggleOne(id)}
                            />
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-100">
                          {formatDateTime(item?.createdAt || item?.date)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-200">{item?.paymentMethod || item?.category || "-"}</td>
                        <td className="px-4 py-3 text-sm text-slate-200">
                          <div className="max-w-[42ch] truncate" title={item?.description || ""}>
                            {item?.description || "-"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-cyan-300">
                          {formatCurrency(item?.rs || item?.amount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-300">
                          {formatDateTime(item?.deletedAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => (id ? restoreExpenses([id]) : null)}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300 transition hover:bg-emerald-500/20"
                              title="Restore"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restore
                            </button>
                            <button
                              type="button"
                              onClick={() => (id ? deleteForever([id]) : null)}
                              className="inline-flex items-center gap-1 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-sm text-red-300 transition hover:bg-red-500/20"
                              title="Delete forever"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-200 shadow-lg sm:flex-row">
          <div className="text-sm">
            Showing <span className="font-medium">{items.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to <span className="font-medium">{(page - 1) * pageSize + items.length}</span> of <span className="font-medium">{total}</span> results
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <label htmlFor="pageSize" className="text-sm text-slate-400">
                Rows:
              </label>
              <select
                id="pageSize"
                className="rounded-md border border-white/10 bg-slate-950/90 px-2 py-1 text-sm text-white"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`inline-flex items-center rounded-md border px-2 py-1.5 text-sm ${
                  page <= 1 || loading
                    ? "border-slate-700 text-slate-500"
                    : "border-white/10 text-slate-200 hover:bg-slate-900"
                }`}
                title="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-slate-300">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
              </span>
              <button
                type="button"
                disabled={page >= pages || loading}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className={`inline-flex items-center rounded-md border px-2 py-1.5 text-sm ${
                  page >= pages || loading
                    ? "border-slate-700 text-slate-500"
                    : "border-white/10 text-slate-200 hover:bg-slate-900"
                }`}
                title="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <ToastContainer position="top-right" closeOnClick newestOnTop limit={1} />
      </div>
    </div>
  );
}

function Th({ label, sortKey, sortBy, sortDir, onSort, align = "left" }) {
  const active = sortBy === sortKey;
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-${align} text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 select-none`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 ${active ? "text-white" : "text-slate-200 hover:text-white"}`}
      >
        {label}
        <span
          className={`transition-transform ${active ? "opacity-100" : "opacity-0"} ${active && sortDir === "desc" ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▲
        </span>
      </button>
    </th>
  );
}