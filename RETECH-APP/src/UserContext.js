import React from 'react';

const UserContext = React.createContext();


// The "Provider" component allows other components to consume/use the context object and supply the necessary information needed to the context object.
export const UserProvider = UserContext.Provider


export default UserContext