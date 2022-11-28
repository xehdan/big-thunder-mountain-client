import React, { createContext, useState } from "react";

// create context
const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    // the value that will be given to the context
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState({
        fullName: 'John Francis Doe jr.',
        firstName: 'John',
        nickname: 'Johnny',
        lastName: 'Doe',
        mail: 'joe.biden@whitehouse.gov',
        username: 'john.doe',
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