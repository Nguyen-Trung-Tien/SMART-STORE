import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ title, value, hint }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </CardHeader>
      <CardContent className="space-y-1">
        <CardTitle className="text-3xl">{value}</CardTitle>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
