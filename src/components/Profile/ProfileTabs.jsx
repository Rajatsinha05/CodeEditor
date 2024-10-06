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

const ProfileTabs = ({ user, isAdmin, isSuperAdmin }) => {
  return (
    <Tabs colorScheme="blue">
      <TabList>
        <Tab>Profile</Tab>
        {(isAdmin || isSuperAdmin) && <Tab>Rankings</Tab>}
        {user?.role === "STUDENT" && <Tab>Stats</Tab>}
        {(isAdmin || isSuperAdmin) && <Tab>Students</Tab>}
      </TabList>
      <TabPanels>
        <TabPanel>
          <Heading size="lg">Welcome, {user.name}</Heading>
        </TabPanel>

        {(isAdmin || isSuperAdmin) && (
          <TabPanel>
            <VStack spacing={4}>
              <Heading size="md">Ranking</Heading>
              <Rankings />
            </VStack>
          </TabPanel>
        )}

        {user?.role === "STUDENT" && (
          <TabPanel>
            <StudentStats student={{ ...user }} />
          </TabPanel>
        )}

        {(isAdmin || isSuperAdmin) && (
          <TabPanel>
            <VStack spacing={4}>
              <Heading size="md">Students Management</Heading>
              <Students />
            </VStack>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default ProfileTabs;
