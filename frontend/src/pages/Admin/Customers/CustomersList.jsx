import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, MoreHorizontal, Mail, Ban, Edit, Shield
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomersList() {
  const [customers] = useState([
    { id: "CUS-001", name: "Olivia Martin", email: "olivia@email.com", role: "User", orders: 12, spent: "$4,999.00", status: "Active", joined: "Oct 2022" },
    { id: "CUS-002", name: "Jackson Lee", email: "jackson@email.com", role: "User", orders: 3, spent: "$1,239.00", status: "Active", joined: "Jan 2023" },
    { id: "CUS-003", name: "Isabella Nguyen", email: "isabella@email.com", role: "VIP", orders: 45, spent: "$12,299.00", status: "Active", joined: "Mar 2021" },
    { id: "CUS-004", name: "William Kim", email: "will@email.com", role: "User", orders: 1, spent: "$99.00", status: "Inactive", joined: "Oct 2023" },
    { id: "CUS-005", name: "Sofia Davis", email: "sofia@email.com", role: "Banned", orders: 0, spent: "$0.00", status: "Banned", joined: "Nov 2023" },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0">Active</Badge>;
      case 'Inactive': return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-0">Inactive</Badge>;
      case 'Banned': return <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-0">Banned</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'VIP': return <Badge variant="outline" className="text-amber-500 border-amber-500/30">VIP</Badge>;
      case 'Banned': return <Badge variant="outline" className="text-rose-500 border-rose-500/30">Banned</Badge>;
      default: return <Badge variant="outline" className="text-muted-foreground">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground mt-1">Manage user accounts and profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button>Add Customer</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search customers..." className="pl-9 bg-background" />
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
                <TableHead className="font-semibold pl-6">Customer</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Orders</TableHead>
                <TableHead className="font-semibold">Total Spent</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(customer.role)}</TableCell>
                  <TableCell className="font-medium">{customer.orders}</TableCell>
                  <TableCell className="font-medium">{customer.spent}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.joined}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
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
                          <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" /> Manage Roles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-100 dark:focus:bg-rose-950">
                          <Ban className="mr-2 h-4 w-4" /> Suspend User
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
              Showing <strong>1</strong> to <strong>5</strong> of <strong>5</strong> results
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
