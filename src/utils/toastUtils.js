// utils/toastUtils.js
export const showToast = (
  toast,
  description,
  status = "info",
  duration = 3000
) => {
  toast({
    description,
    status,
    duration,
    isClosable: true,
    position: "top", // Always top center
    containerStyle: { maxWidth: "240px", padding: "5px" },
  });
};
