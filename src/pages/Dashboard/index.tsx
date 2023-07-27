import { useEffect } from 'react';
import userInfoStore from '@/store/userInfoStore';

function Dashboard() {
    const { userName, userAddress } = userInfoStore();

    console.log(userName, userAddress);

    return <div>index</div>;
}

export default Dashboard;
