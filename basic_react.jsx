import React, { useState } from 'react';

function App() {
    // This is a React Hook to manage state
    const [count, setCount] = useState(0); // 'count' is the state, 'setCount' updates it

    return (
        <div>
            <h1>Counter: {count}</h1>
            {/* Button that updates the counter */}
            <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
    );
}

export default App;

