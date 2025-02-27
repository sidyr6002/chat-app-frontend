import { FaArrowRightFromBracket } from "react-icons/fa6";

import tabs from "./tabs";

import { cn } from "~/lib/utils";
import { useTabs } from "~/contexts/tab-context";

const SideBar = () => {
    const { activeTab, setActiveTab } = useTabs();

    return (
        <div className="bg-zinc-50 z-10 absolute left-0 bottom-0 lg:static h-fit lg:h-full w-full lg:max-w-20 flex flex-row lg:flex-col px-1 py-1.5 lg:px-2 lg:py-4">
            {/* Logo Section */}
            <h1 className="hidden lg:block">SideBar</h1>

            {/* Mobile Section Tabs */}
            <div className="flex-grow flex lg:flex-col gap-2">
                {/* Tabs Section */}
                <div className="flex-grow flex flex-row lg:flex-col justify-center items-center gap-2 lg:gap-6">
                    {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        className={cn(
                        "w-full flex lg:flex-col justify-center items-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all duration-200",
                        activeTab === tab.name
                            ? "text-blue-600 bg-blue-100/80"
                            : "hover:text-blue-600 hover:bg-gray-200"
                        )}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        <tab.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span className="hidden lg:block text-xs">{tab.name}</span>
                    </div>
                    ))}
                </div>
                
                {/* Logout Section */}
                <div className="h-full lg:w-full lg:h-fit flex lg:flex-col gap-1.5 p-2 items-center rounded-lg cursor-pointer hover:bg-gray-200 group">
                    <FaArrowRightFromBracket className="w-5 h-5 lg:w-6 lg:h-6 cursor-pointer text-red-500 group-hover:text-red-600 lg:group-hover:scale-110 transition" />
                    <span className="hidden lg:block text-xs">Logout</span>
                </div>
            </div>
        </div>
    )
}

export default SideBar