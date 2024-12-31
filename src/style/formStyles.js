// styles/formStyles.js
export const getCustomSelectStyles = () => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: bgColor,
    color: textColor,
    borderColor: borderColor,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? primaryColor : optionBgColor,
    color: textColor,
    "&:hover": {
      backgroundColor: optionHoverBgColor,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: textColor,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: bgColor,
    zIndex: 9999,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: placeholderColor,
  }),
});

