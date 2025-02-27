import SearchInput from '../../inputs/search-input'

import RecentChats from './recent-chats'

const Chats = () => {
  return (
    <div className='w-full h-full flex flex-col'>
      <div className='mb-8'>
        <h1 className='text-2xl text-blue-700 font-semibold'>Chats</h1>
        <SearchInput />
      </div>
      <RecentChats />
    </div>
  )
}

export default Chats