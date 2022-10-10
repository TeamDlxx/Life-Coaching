
import React, {useState} from 'react';
import {ContextProvider} from '.';

const ContextWrapper = props => {
  const [Token, setToken] = useState(null);
  const [habitList, setHabitList] = useState([]);
  return (
    <>
      <ContextProvider value={{Token, setToken, habitList, setHabitList}}>
        {props.children}
      </ContextProvider>
    </>
  );
};

export default ContextWrapper;
