import front from "../settings/Frontend"



export const renderErrorMessage = (data, errors_prop, setErrorMsg) => {
  let errors = ""
  if (data.hasOwnProperty(errors_prop)) {
    for (let error of data[errors_prop]) {
      if (error) errors += error
    }
  }
  setErrorMsg(errors)
}

export const handleSubmit = async (e, action, params) => {
  e.preventDefault()

  // const findErrorElement = (fieldType) => {
  //   const parentFormId = e.nativeEvent.originalTarget.parentElement.id.replace('-form', '')
  //   return document.querySelector(`#${parentFormId}-${fieldType}-field-error`)
  // }
  
  // if (!validateEmail(e.target.elements)) {
  //   const errorTextElement = findErrorElement('email')
  //   errorTextElement.innerHTML = front.errors.email_invalid
  //   return
  // }

  await action(params)
}

function validateEmail(elements) {
  let emailInput;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.id.includes("email")) {
      emailInput = element;
      break;
    }
  }
  return emailInput.validity.valid ? false : true;
}