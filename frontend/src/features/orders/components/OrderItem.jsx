export function OrderItem({ item }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0 border-black/5 dark:border-white/5">
      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-contain p-1"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-bold truncate leading-tight">
          {item.name}
        </h4>
        <p className="text-[8px] font-black text-muted-foreground mt-0.5 uppercase tracking-widest opacity-60">
          x{item.amount}
        </p>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <span className="text-[11px] font-black tracking-tight">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.price)}
        </span>
      </div>
    </div>
  );
}
