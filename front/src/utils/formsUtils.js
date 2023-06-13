import FrontendSettings from "../settings/Frontend"

const front = FrontendSettings()

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
  if (validateEmail(e.target.elements)) {
    console.log("No Valid email")
    const errorTextElement = document.querySelector('#register-email-field-error')
    errorTextElement.innerHTML = front.errors.email_invalid
    return
  }
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
  return emailInput.validity.valid ? true : false;
}