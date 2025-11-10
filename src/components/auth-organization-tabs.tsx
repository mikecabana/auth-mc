"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/client";
import { AuthInvitesTab } from "./auth-invites-tab";
import { AuthMembersTab } from "./auth-members-tab";
import { AuthSubscriptionsTab } from "./auth-subscriptions-tab";

export function AuthOrganizationTabs() {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <div className="space-y-4">
      {activeOrganization && (
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
          <Card>
            <CardContent>
              <TabsContent value="members">
                <AuthMembersTab />
              </TabsContent>

              <TabsContent value="invitations">
                <AuthInvitesTab />
              </TabsContent>

              <TabsContent value="subscriptions">
                {/* <AuthSubscriptionsTab /> */}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  );
}
