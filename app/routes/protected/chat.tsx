import ChatSection from '~/components/chat/chat-section';
import SideBar from '~/components/tabs/side-bar';
import TabSection from '~/components/tabs/tab-section';

const Chat = () => {
    return (
        <div className='h-svh w-svw flex flex-col lg:flex-row'>
            <SideBar />
            <div className="w-full h-full flex relative overflow-hidden">
                <TabSection />
                <ChatSection />
            </div>
        </div>
    );
};

export default Chat;
