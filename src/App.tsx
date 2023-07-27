import RouterApp from '@/sections/RouterApp';

import reactLogo from '@/assets/react.svg';

function App() {
    return (
        <div
            className={
                process.env.NODE_ENV === 'development' ? 'debug-screens' : ''
            }
        >
            <RouterApp />
        </div>
    );
}

export default App;
