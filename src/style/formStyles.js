// styles/formStyles.js
export const getCustomSelectStyles = (theme, isDarkMode) => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode
      ? theme.colors.gray[800]
      : theme.colors.gray[100],
    color: isDarkMode
      ? theme.colors.whiteAlpha[900]
      : theme.colors.blackAlpha[900],
    borderColor: isDarkMode
      ? theme.colors.whiteAlpha[300]
      : theme.colors.blackAlpha[300],
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? isDarkMode
        ? theme.colors.gray[700]
        : theme.colors.gray[200]
      : isDarkMode
      ? theme.colors.gray[800]
      : theme.colors.gray[100],
    color: isDarkMode
      ? theme.colors.whiteAlpha[900]
      : theme.colors.blackAlpha[900],
    "&:hover": {
      backgroundColor: isDarkMode
        ? theme.colors.gray[600]
        : theme.colors.gray[200],
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: isDarkMode ? theme.colors.gray[400] : theme.colors.gray[600],
  }),
});
