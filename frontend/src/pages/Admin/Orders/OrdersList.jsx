import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, MoreHorizontal, Eye, Truck, CheckCircle2, XCircle, Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrdersList() {
  const [orders] = useState([
    { id: "ORD-9821", customer: "Olivia Martin", email: "olivia@email.com", date: "2023-10-23", total: "$1,999.00", status: "Completed", payment: "Paid" },
    { id: "ORD-9822", customer: "Jackson Lee", email: "jackson@email.com", date: "2023-10-23", total: "$39.00", status: "Processing", payment: "Paid" },
    { id: "ORD-9823", customer: "Isabella Nguyen", email: "isabella@email.com", date: "2023-10-22", total: "$299.00", status: "Completed", payment: "Paid" },
    { id: "ORD-9824", customer: "William Kim", email: "will@email.com", date: "2023-10-22", total: "$99.00", status: "Pending", payment: "Unpaid" },
    { id: "ORD-9825", customer: "Sofia Davis", email: "sofia@email.com", date: "2023-10-21", total: "$39.00", status: "Cancelled", payment: "Refunded" },
    { id: "ORD-9826", customer: "Lucas Garcia", email: "lucas@email.com", date: "2023-10-21", total: "$5,499.00", status: "Shipped", payment: "Paid" },
    { id: "ORD-9827", customer: "Mia Johnson", email: "mia@email.com", date: "2023-10-20", total: "$129.00", status: "Completed", payment: "Paid" },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'Processing': return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>;
      case 'Pending': return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-0"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'Shipped': return <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-0"><Truck className="w-3 h-3 mr-1" /> Shipped</Badge>;
      case 'Cancelled': return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-0"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (payment) => {
    switch (payment) {
      case 'Paid': return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">Paid</Badge>;
      case 'Unpaid': return <Badge variant="outline" className="text-rose-500 border-rose-500/30">Unpaid</Badge>;
      case 'Refunded': return <Badge variant="outline" className="text-slate-500 border-slate-500/30">Refunded</Badge>;
      default: return <Badge variant="outline">{payment}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground mt-1">Manage and track customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button>Create Order</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by order ID, email, or name..." className="pl-9 bg-background" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold pl-6">Order ID</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="text-right font-semibold">Total</TableHead>
                <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <TableCell className="font-medium pl-6">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customer}</span>
                      <span className="text-xs text-muted-foreground">{order.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                  <TableCell className="text-right font-medium">{order.total}</TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" /> Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-100 dark:focus:bg-rose-950">
                          <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1</strong> to <strong>7</strong> of <strong>7</strong> results
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
