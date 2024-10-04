// validators.js
export const formDataValidator = (formData) => {
    const errors = {};
  
    if (!formData.title.trim()) {
      errors.title = true;
    }
    if (!formData.description.trim()) {
      errors.description = true;
    }
    if (!formData.difficultLevel.trim()) {
      errors.difficultLevel = true;
    }
    if (!formData.constraintValue.trim()) {
      errors.constraintValue = true;
    }
    if (!formData.input.trim()) {
      errors.input = true;
    }
    if (!formData.expectedOutput.trim()) {
      errors.expectedOutput = true;
    }
    if (!formData.tag.trim()) {
      errors.tag = true;
    }
  
    return errors;
  };
  