import React, { useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import ProfileForm from "./ProfileForm";

const ProfileTabs = ({ isAdmin }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Tabs
      index={selectedTab}
      onChange={(index) => setSelectedTab(index)}
      colorScheme="blue"
    >
      <TabList>
        <Tab>Create User</Tab>
        <Tab>Create Student</Tab>
        <Tab>Other Features</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProfileForm isAdmin={isAdmin} />
        </TabPanel>
        <TabPanel>
          <ProfileForm isAdmin={isAdmin} />
        </TabPanel>
        <TabPanel>
          {/* Other Features Panel */}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProfileTabs;
