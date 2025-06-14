import React, { useCallback, useState } from 'react'

const useAddState = (dataSetter: React.SetStateAction<any>, dummyDataObj: any) => {

  const [addState, setAddState] = useState(false);

  const enableAddState = useCallback(() => {
    dataSetter((prev: any) => {
      return [dummyDataObj, ...prev]
    })
    setAddState(true)
  }, [])
  
  const disableAddState = useCallback(() => {
    dataSetter((prev: any) => prev.slice(1))
    setAddState(false);
  }, [])

  return {
    addState,
    setAddState,
    enableAddState,
    disableAddState
  }
}

export default useAddState