import React, { createContext, useState, useEffect } from "react";

// create context
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    // the value that will be given to the context
    const [user, setUser] = useState({
        fullName: 'Joseph Robinette Biden jr.',
        firstName: 'Joseph',
        nickname: 'Joe',
        lastName: 'Biden',
        mail: 'joe.biden@whitehouse.gov',
        username: 'joe.biden',
        phone: '012345678910'
    });

    return (
        // the Provider gives access to the context to its children
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };