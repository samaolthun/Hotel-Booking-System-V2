import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Profile() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/default-profile.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="mt-1">John Doe</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="mt-1">john@example.com</p>
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <p className="mt-1">User</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
