// components/dashboard-header.tsx
import { Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-green-900">
          BCS Prep Pro ড্যাশবোর্ড
        </h1>
        <p className="text-green-700 mt-2">
          আপনার BCS প্রস্তুতি জার্নি ট্র্যাক করুন এবং উন্নতি করুন
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          প্রিমিয়াম
        </Badge>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}