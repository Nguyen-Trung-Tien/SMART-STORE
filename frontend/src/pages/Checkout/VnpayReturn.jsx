import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useVerifyVnpayPayment } from "@/hooks/api/usePayment";
import { formatCurrency } from "@/lib/formatter";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function VnpayReturnPage() {
  const [searchParams] = useSearchParams();
  const verifyVnpayPayment = useVerifyVnpayPayment();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const updateCalled = useRef(false);

  const responseCode = searchParams.get("vnp_ResponseCode");
  const orderId = searchParams.get("vnp_TxnRef");
  const rawAmount = searchParams.get("vnp_Amount");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const bankCode = searchParams.get("vnp_BankCode");
  const payDate = searchParams.get("vnp_PayDate"); // Format: YYYYMMDDHHmmss

  const amount = rawAmount ? Number(rawAmount) / 100 : 0;
  const formattedDate = payDate
    ? dayjs(payDate, "YYYYMMDDHHmmss").format("DD/MM/YYYY HH:mm:ss")
    : dayjs().format("DD/MM/YYYY HH:mm:ss");

  useEffect(() => {
    if (updateCalled.current) return;
    updateCalled.current = true;
    setStatus("loading");

    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    verifyVnpayPayment.mutate(params, {
      onSuccess: () => {
        setStatus("success");
      },
      onError: (err) => {
        console.error("Failed to verify VNPay payment", err);
        setStatus("error");
        setErrorMsg(err.message || "Failed to verify payment status on server.");
      },
    });
  }, [verifyVnpayPayment]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-enter">
      <Card className="w-full max-w-lg shadow-2xl border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <CardContent className="pt-8 px-6 pb-6 text-center space-y-6">
          {status === "loading" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-full animate-pulse">
                <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                Verifying Payment
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
                Please wait while we verify your transaction and update your order details.
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/25 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                  Payment Successful!
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Your transaction has been completed, and your order has been processed.
                </p>
              </div>

              {/* Transaction details card */}
              <div className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 text-left space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <span className="text-neutral-400">Order Reference</span>
                  <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                    {orderId}
                  </span>
                </div>
                {transactionNo && (
                  <div className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <span className="text-neutral-400">VNPay Transaction No</span>
                    <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                      {transactionNo}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <span className="text-neutral-400">Amount Paid</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(amount, "VND", "vi-VN")}
                  </span>
                </div>
                {bankCode && (
                  <div className="flex justify-between items-center text-sm border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <span className="text-neutral-400">Bank Code</span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {bankCode}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-400">Payment Date</span>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                  <XCircle className="w-16 h-16 text-rose-500" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                  Payment Failed
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {errorMsg || "We encountered an issue while processing your VNPay payment."}
                </p>
              </div>

              {orderId && (
                <div className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 text-left">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">Order Reference</span>
                    <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                      {orderId}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 px-6 py-4 flex flex-col sm:flex-row gap-3">
          {status === "success" ? (
            <>
              <Button asChild className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md transition duration-200">
                <Link to="/orders" className="flex items-center justify-center gap-2">
                  <Receipt className="w-4 h-4" /> View My Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:flex-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Link to="/products" className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Keep Shopping
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-full sm:flex-1 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 font-medium shadow-md transition duration-200">
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  Try Again <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:flex-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Link to="/products" className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Keep Shopping
                </Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
