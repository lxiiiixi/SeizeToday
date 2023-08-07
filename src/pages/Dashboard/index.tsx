import { useEffect } from 'react';
import userInfoStore from '@/store/userInfoStore';

function Dashboard() {
    const { userName, userAddress, setUserName } = userInfoStore();
    // 不要用这种写法

    return (
        <div>
            <button onClick={() => setUserName('new name')}>
                set new username
            </button>
        </div>
    );
}

export default Dashboard;
