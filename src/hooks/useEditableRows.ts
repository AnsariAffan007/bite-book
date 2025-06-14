import { useCallback, useState } from "react"

const useEditableRows = () => {

  const [editableRows, setEditableRows] = useState<Record<number, boolean>>({});
  const changeEditableRow = useCallback((index: number, value: boolean) => {
    setEditableRows(prev => ({
      ...prev,
      [index]: value
    }))
  }, [])

  return {
    editableRows,
    changeEditableRow
  }
}

export default useEditableRows