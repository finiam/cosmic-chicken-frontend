import AppHeader from "@/lib/components/AppHeader";
import ClientOnly from "@/lib/components/ClientOnly";
import Connect from "@/lib/components/Connect";
import { useAccount } from "wagmi";
import { LoansMock, LoanMockType } from "@/lib/data/loansMock";
import { useEffect, useMemo, useState } from "react";
import Router from "next/router";
import LoanCard from "@/lib/components/LoanCard";

export default function StorageProvider() {
  const { address, isConnected } = useAccount();
  const [loanFilter, setLoanFilter] = useState<"current" | "finished">("current");
  const [hasFirstDeposit, setHasFirstDeposit] = useState(true);

  const userLoans = useMemo(() => {
    if (!address) return;

    return LoansMock.filter(
      loan => loan.address.toLowerCase() === (address as string).toLowerCase()
    );
  }, [address]);

  const displayLoans = useMemo(() => {
    switch (loanFilter) {
      case "finished":
        return userLoans?.filter(loan => loan.status === "closed");

      case "current":
        return userLoans?.filter(loan => loan.status === "active");

      default:
        return userLoans;
    }
  }, [loanFilter, userLoans]);

  useEffect(() => {
    if (!address) return;

    !hasFirstDeposit && Router.push("deposit");
  }, [address]);

  return (
    <ClientOnly>
      <div>
        {!isConnected ? (
          <div className="mx-auto mt-96 w-fit">
            <Connect />
          </div>
        ) : (
          <>
            <AppHeader type="Storage Provider" />
            <main className="text-lg max-w-4xl mx-auto py-24">
              <div className="flex justify-between mb-8">
                <div className="flex gap-6">
                  <button
                    className={`btn-beige ${loanFilter === "current" ? "bg-offwhite" : ""}`}
                    onClick={() => setLoanFilter("current")}
                  >
                    Current
                  </button>
                  <button
                    className={`btn-beige ${loanFilter === "finished" ? "bg-offwhite" : ""}`}
                    onClick={() => setLoanFilter("finished")}
                  >
                    Expired
                  </button>
                </div>
                <button
                  className="btn-orange"
                  onClick={() => Router.push("/storage-provider/deposit")}
                >
                  Deposit
                </button>
              </div>
              {displayLoans && displayLoans.length > 0 ? (
                <div className="flex flex-col gap-12">
                  {displayLoans
                    .sort((a, b) => Number(b.loan_id) - Number(a.loan_id))
                    .map(loan => (
                      <LoanCard loan={loan} key={loan.loan_id} />
                    ))}
                </div>
              ) : (
                loanFilter === "current" && (
                  <div className="mt-32 mx-auto w-fit">
                    <button className="btn-brown" onClick={() => console.log("request-loan")}>
                      Request new loan
                    </button>
                  </div>
                )
              )}
            </main>
          </>
        )}
      </div>
    </ClientOnly>
  );
}