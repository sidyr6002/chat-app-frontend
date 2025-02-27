import React, { createContext, useState, useContext } from 'react';

import { TabType } from '~/components/tabs/tabs';

interface TabsContextType {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('Chats');

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabsContext.Provider>
    );
};

export const useTabs = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('useTabs must be used within a TabsProvider');
    }
    return context;
};
