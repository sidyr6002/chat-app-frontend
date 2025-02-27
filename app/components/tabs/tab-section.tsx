import React, { useMemo, useRef } from 'react';

import tabs, { TabType } from './tabs';

import { useTabs } from '~/contexts/tab-context';

const TabSection = () => {
    const { activeTab } = useTabs();
    const tabsRef = useRef(tabs);

    const tabsMap = useMemo(() => {
        return new Map<TabType, React.FC>(
            tabsRef.current.map((tab) => [tab.name, tab.component])
        );
    }, []);

    const ActiveTabComponent = useMemo(() => {
        return tabsMap.get(activeTab);
    }, [tabsMap, activeTab]);

    return (
        <div className="bg-gray-200/80 lg:min-w-96 lg:max-w-96 w-full h-svh px-4 py-6">
            {ActiveTabComponent ? (
                <ActiveTabComponent />
            ) : (
                <div>Tab not found</div>
            )}
        </div>
    );
};

export default TabSection;
