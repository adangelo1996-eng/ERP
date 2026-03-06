"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Role } from "./api";

const ROLES: Role[] = [
  "ADMIN",
  "FINANCE_MANAGER",
  "PRODUCTION_PLANNER",
  "PROCUREMENT_MANAGER",
  "HR_MANAGER",
];

type RoleContextType = {
  role: Role;
  setRole: (r: Role) => void;
  roles: Role[];
};

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("FINANCE_MANAGER");
  const setRole = useCallback((r: Role) => setRoleState(r), []);
  return (
    <RoleContext.Provider value={{ role, setRole, roles: ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
