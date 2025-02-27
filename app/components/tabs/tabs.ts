import { IconType } from "react-icons/lib";
import { FaUser, FaUserGroup, FaAddressBook, FaGear } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";

import Profile from "./profile/profile";
import Groups from "./groups/groups";
import Chats from "./chats/chats";
import Contacts from "./contacts/contacts";
import Settings from "./settings/settings";

export type TabType = "Profile" | "Groups" | "Chats" | "Contacts" | "Settings"

type Tab = {
    name: TabType;
    icon: IconType;
    component: React.FC;
}

const tabs: Tab[] = [
    {
        name: "Profile",
        icon: FaUser,
        component: Profile
    },
    {
        name: "Groups",
        icon: FaUserGroup,
        component: Groups
    },
    {
        name: "Chats",
        icon: MdMessage,
        component: Chats
    },
    {
        name: "Contacts",
        icon: FaAddressBook,
        component: Contacts
    },
    {
        name: "Settings",
        icon: FaGear,
        component: Settings
    }
]

export default tabs