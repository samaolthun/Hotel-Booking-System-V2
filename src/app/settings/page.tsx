"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";

export default function Settings() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Change the appearance of the application
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your bookings
              </p>
            </div>
            <Switch />
          </div>
          {/* Add more settings options as needed */}
        </CardContent>
      </Card>
    </div>
  );
}
