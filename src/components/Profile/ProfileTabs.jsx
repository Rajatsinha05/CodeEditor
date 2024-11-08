import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  VStack,
  Heading,
} from "@chakra-ui/react";
import StudentStats from "./StudentStats";
import Rankings from "./Rankings";
import Students from "./Students";
import Users from "./Users";

const ProfileTabs = ({ user }) => {
  const isAdmin = user?.role === "ADMIN";
  const isSuperAdmin = user?.role === "SUPERADMIN";

  return (
    <Tabs colorScheme="blue">
      <TabList>
        <Tab>Profile</Tab>
        {(isAdmin || isSuperAdmin) && <Tab>Rankings</Tab>}
        {user?.role === "STUDENT" && <Tab>Stats</Tab>}
        {(isAdmin || isSuperAdmin) && <Tab>Students</Tab>}
        {(isAdmin || isSuperAdmin) && <Tab>Users</Tab>}
      </TabList>
      <TabPanels>
        {/* Profile Tab */}
        <TabPanel>
          <Heading size="lg">Welcome, {user.name}</Heading>
        </TabPanel>

        {/* Rankings Tab for Admins and Superadmins */}
        {(isAdmin || isSuperAdmin) && (
          <TabPanel>
            <VStack spacing={4}>
              <Heading size="md">Rankings</Heading>
              <Rankings />
            </VStack>
          </TabPanel>
        )}

        {/* Stats Tab for Students */}
        {user?.role === "STUDENT" && (
          <TabPanel>
            <StudentStats student={{ ...user }} />
          </TabPanel>
        )}

        {/* Students Management Tab for Admins and Superadmins */}
        {(isAdmin || isSuperAdmin) && (
          <TabPanel>
            <VStack spacing={4}>
              <Heading size="md">Students Management</Heading>
              <Students branchCode={isAdmin ? user.branchCode : "SUPERADMIN"} />
            </VStack>
          </TabPanel>
        )}

        {/* Users Management Tab for Admins and Superadmins */}
        {(isAdmin || isSuperAdmin) && (
          <TabPanel>
            <VStack spacing={4}>
              <Heading size="md">Users Management</Heading>
              <Users branchCode={isAdmin ? user.branchCode : "SUPERADMIN"} />
            </VStack>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default ProfileTabs;
