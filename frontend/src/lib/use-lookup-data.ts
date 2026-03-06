"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

export type Supplier = { id: string; code: string; name: string };
export type Employee = { id: string; code: string; fullName: string };
export type ProductionItem = { id: string; itemId: string };
export type Warehouse = { id: string; code: string; name: string };
export type Location = { id: string; code: string; warehouse?: Warehouse };
export type PurchaseRequest = { id: string; itemId: string; quantity: string; status: string };
export type SupplierInvoice = { id: string; supplierId: string; totalNet: string; status: string };
export type ManufacturingOrder = { id: string; itemId?: string; status: string };

export type LookupData = {
  suppliers: Supplier[];
  employees: Employee[];
  items: ProductionItem[];
  warehouses: Warehouse[];
  locations: Location[];
  purchaseRequests: PurchaseRequest[];
  supplierInvoices: SupplierInvoice[];
  manufacturingOrders: ManufacturingOrder[];
  loading: boolean;
  refresh: () => void;
};

export function useLookupData(): LookupData {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>([]);
  const [manufacturingOrders, setManufacturingOrders] = useState<ManufacturingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [sRes, eRes, iRes, wRes, prRes, siRes, moRes] = await Promise.all([
      api.procurement.listSuppliers(),
      api.hr.listEmployees(),
      api.production.listItems(),
      api.warehouse.listWarehouses(),
      api.procurement.listPurchaseRequests(),
      api.finance.listSupplierInvoices(),
      api.production.listMOs(),
    ]);
    if (sRes.ok) setSuppliers(await sRes.json());
    if (eRes.ok) setEmployees(await eRes.json());
    if (iRes.ok) {
      const raw = await iRes.json();
      setItems(Array.isArray(raw) ? raw : []);
    }
    if (wRes.ok) {
      const wh = await wRes.json();
      setWarehouses(wh);
      const whCode = Array.isArray(wh) && wh.length > 0 ? wh[0].code : null;
      if (whCode) {
        const locRes = await api.warehouse.listLocations(whCode);
        if (locRes.ok) setLocations(await locRes.json());
      }
    }
    if (prRes.ok) setPurchaseRequests(await prRes.json());
    if (siRes.ok) setSupplierInvoices(await siRes.json());
    if (moRes.ok) setManufacturingOrders(await moRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    suppliers,
    employees,
    items,
    warehouses,
    locations,
    purchaseRequests,
    supplierInvoices,
    manufacturingOrders,
    loading,
    refresh: load,
  };
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
