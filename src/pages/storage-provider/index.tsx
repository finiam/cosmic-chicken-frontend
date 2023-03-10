import AppHeader from "@/lib/components/AppHeader";
import ClientOnly from "@/lib/components/ClientOnly";
import Connect from "@/lib/components/Connect";
import { useAccount, useContractRead, useQuery } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import Router from "next/router";
import LoanCard from "@/lib/components/LoanCard";
import Link from "next/link";
import abi from "../../lib/abi/pool.json";
import { POOL_CONTRACT } from "../../lib/constants";
import { truncateAmount } from "@/lib/utils/truncate";

export default function StorageProvider() {
  const { address, isConnected } = useAccount();
  const [loanFilter, setLoanFilter] = useState<"current" | "finished">("current");
  const [balance, setBalance] = useState<number>();

  const { data: loans }: { data?: Array<LoanData> } = useQuery(
    ["loans", address],
    async () => await (await fetch("/api/loans/" + address?.toLowerCase())).json(),
    {
      enabled: !!address,
      refetchInterval: 10000,
    }
  );

  const { data } = useContractRead({
    address: POOL_CONTRACT,
    abi,
    functionName: "storageProviderBalance",
    args: [address],
  });

  useEffect(() => {
    data && setBalance(parseInt(data as string) * 10 ** -18);
  }, [data]);

  const displayLoans = useMemo(() => {
    switch (loanFilter) {
      case "finished":
        return loans?.filter(
          loan =>
            Number(loan.projection_fields.repaid_amount) >=
            Number(loan.projection_fields.total_amount)
        );

      case "current":
        return loans?.filter(
          loan =>
            Number(loan.projection_fields.repaid_amount) <
            Number(loan.projection_fields.total_amount)
        );

      default:
        return loans;
    }
  }, [loanFilter, loans]);

  useEffect(() => {
    if (!balance) return;

    !(balance > 0) && Router.push("/storage-provider/deposit");
  }, [balance]);

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
                    className={`btn btn-beige ${loanFilter === "current" ? "bg-offwhite" : ""}`}
                    onClick={() => setLoanFilter("current")}
                  >
                    Current
                  </button>
                  <button
                    className={`btn btn-beige ${loanFilter === "finished" ? "bg-offwhite" : ""}`}
                    onClick={() => setLoanFilter("finished")}
                  >
                    Expired
                  </button>
                </div>
                <Link href="/storage-provider/deposit" className="btn btn-orange">
                  Deposit
                </Link>
              </div>
              <div className="bg-offwhite shadow-xl rounded-3xl px-12 py-8 mb-5 flex justify-between">
                <p>Total balance</p>
                <span className="text-3xl font-bold">{truncateAmount(balance || 0)} TFIL</span>
              </div>
              {displayLoans && displayLoans.length > 0 ? (
                <div className="flex flex-col gap-12">
                  {displayLoans
                    .sort((a, b) => Number(b.projection_id) - Number(a.projection_id))
                    .map(loan => (
                      <LoanCard loan={loan} key={loan.projection_id} />
                    ))}
                </div>
              ) : (
                loanFilter === "current" && (
                  <div className="mt-32 mx-auto w-fit">
                    <Link href="/storage-provider/request-loan" className="btn btn-brown">
                      Request new loan
                    </Link>
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
