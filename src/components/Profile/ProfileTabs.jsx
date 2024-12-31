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
  if (!user || !user.role) {
    // Fallback for cases where `user` is undefined or role is missing
    return <Heading size="lg">Invalid User Data</Heading>;
  }

  const isAdmin = user.role === "ADMIN";
  const isSuperAdmin = user.role === "SUPERADMIN";

  return (
    <Tabs colorScheme="blue">
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Rankings</Tab>
        {user.role === "STUDENT" && <Tab>Stats</Tab>}
        {(isAdmin || isSuperAdmin) && <Tab>Students</Tab>}
        {(isAdmin || isSuperAdmin) && <Tab>Users</Tab>}
      </TabList>
      <TabPanels>
        {/* Profile Tab */}
        <TabPanel>
          <Heading size="lg">Welcome, {user.name || "User"}</Heading>
        </TabPanel>

        {/* Rankings Tab for Admins and Superadmins */}

        <TabPanel>
          <VStack spacing={4}>
            <Rankings />
          </VStack>
        </TabPanel>

        {/* Stats Tab for Students */}
        {user.role === "STUDENT" && (
          <TabPanel>
            <VStack spacing={4}>
              <Heading size="md">Your Stats</Heading>
              <StudentStats student={{ ...user }} />
            </VStack>
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

export default React.memo(ProfileTabs);
