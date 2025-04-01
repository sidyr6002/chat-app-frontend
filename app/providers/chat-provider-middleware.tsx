import React from 'react'

import { ActiveConversationProvider } from '~/contexts/active-chat-context';
import { MobileViewProvider } from '~/contexts/mobile-view';
import { SocketProvider } from '~/contexts/socket-context';
import { TabsProvider } from '~/contexts/tab-context';

const ChatProviderMiddleware: React.FC<{ children: React.ReactNode, accessToken: string}>  = ({ children, accessToken }) => {
  return (
    <MobileViewProvider>
        <TabsProvider>
            <ActiveConversationProvider>
              <SocketProvider accessToken={accessToken}>
                {children}
              </SocketProvider>
            </ActiveConversationProvider>
        </TabsProvider>
    </MobileViewProvider>
  )
}

export default ChatProviderMiddleware;