export const renderErrorMessage = (data, errors_prop, setErrorMsg) => {
  let errors = ""
  if (data.hasOwnProperty(errors_prop)) {
    for (let error of data[errors_prop]) {
      if (error) errors += error + " "
    }
  }
  setErrorMsg(errors)
}

export const handleSubmit = async (e, action, params) => {
  e.preventDefault()
  await action(params)
}