import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// reference： https://github.com/bryanjenningz/react-duolingo/blob/master/src/hooks/useBoundStore.ts

interface UserInfo {
    userName: string;
    setUserName: (name: string) => void;
    userAddress: string;
    setUserAddress: (address: string) => void;
}


const userInfoStore = create<UserInfo>()(
    persist(
        set => ({
            userName: 'none',
            setUserName: name => {
                set(state => ({
                    ...state,
                    userName: name
                }));
            },

            userAddress: 'none',
            setUserAddress: address => {
                set(state => ({
                    ...state,
                    userAddress: address
                }));
            }
        }),
        {
            name: 'test-user-info'
        }
    )
);

export default userInfoStore;
