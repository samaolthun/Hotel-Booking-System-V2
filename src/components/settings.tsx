import {ent";
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {tle,
  Card,"@/src/components/ui/card";
  CardContent, } from "@/src/components/ui/label";
  CardHeader,ch } from "@/src/components/ui/switch";
  CardTitle,meToggle } from "@/src/components/ui/theme-toggle";
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";export default function Settings() {
import { Switch } from "@/src/components/ui/switch";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";lassName="container mx-auto p-6 space-y-6">

export function Profile() {dHeader>
  return (>Settings</CardTitle>
    <div className="container mx-auto p-6 space-y-6">
      <Card>className="space-y-6">
        <CardHeader>ame="flex items-center justify-between">
          <CardTitle>Profile</CardTitle>.5">
        </CardHeader>
        <CardContent>ed-foreground">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/default-profile.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>ter justify-between">
              <Button variant="outline">Change Avatar</Button>assName="space-y-0.5">
            </div>
            <div className="grid gap-4">oreground">
              <div>ive email updates about your bookings
                <label className="text-sm font-medium">Name</label>
                <p className="mt-1">John Doe</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>ore settings options as needed */}
                <p className="mt-1">john@example.com</p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="mt-1">User</p>
              </div>            </div>          </div>        </CardContent>      </Card>      <Card>
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
        </CardContent>
      </Card>
    </div>
  );
}
