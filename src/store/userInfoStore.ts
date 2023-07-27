import create from "zustand";

interface UserInfo {
    userName: string;
    setUserName: (name: string) => void;
    userAddress: string;
    setUserAddress: (address: string) => void;
}

const userInfoStore = create<UserInfo>((set) => ({
    userName:"none",
    setUserName: (name) => {
        set((state) => ({
            ...state,
            userName:name
          }));
    },

    userAddress: "none",
    setUserAddress: (address) => {
        set((state) => ({
            ...state,
            userAddress:address
          }));
    }
}))

export default userInfoStore