// import React, { useRef, useEffect } from "react";
// import { Box, Button, HStack, VStack, Text, useToast } from "@chakra-ui/react";
// import { Editor } from "@monaco-editor/react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   selectCode,
//   selectLanguage,
//   selectTheme,
//   selectFontSize,
//   setCode,
//   setLanguage,
//   setTheme,
//   setFontSize,
// } from "../redux/editorSlice";
// // import { startRecording, stopCameraAccess, selectVideoState } from "../redux/videoSlice";
// import Draggable from "react-draggable";
// import LanguageSelector from "./LanguageSelector";
// import Output from "./Output";
// import CustomSelect from "./CustomSelect";
// import { CODE_SNIPPETS } from "../constants";

// const CodeEditornew = () => {
//   const editorRef = useRef();
//   const videoRef = useRef();
//   const dispatch = useDispatch();
//   const code = useSelector(selectCode);
//   const language = useSelector(selectLanguage);
//   const theme = useSelector(selectTheme);
//   const fontSize = useSelector(selectFontSize);
//   const videoState = useSelector(selectVideoState);
//   const toast = useToast();

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (
//         event.key === "PrintScreen" ||
//         (event.ctrlKey && event.shiftKey && event.key === "S") ||
//         (event.metaKey && event.shiftKey && event.key === "S") ||
//         (event.metaKey &&
//           event.shiftKey &&
//           (event.key === "3" || event.key === "4"))
//       ) {
//         toast({
//           title: "Screenshot Attempt Detected",
//           description: "Screenshots are not allowed.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });

//         event.preventDefault();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [toast]);

//   const onSelect = (language) => {
//     dispatch(setLanguage(language));
//     dispatch(setCode(CODE_SNIPPETS[language]));
//   };

//   const handleThemeChange = (value) => {
//     dispatch(setTheme(value));
//   };

//   const handleFontSizeChange = (value) => {
//     dispatch(setFontSize(value));
//   };

//   const handleStartRecording = () => {
//     dispatch(startRecording());
//   };

//   const handleStopCameraAccess = () => {
//     dispatch(stopCameraAccess());
//   };

//   return (
//     <Box p={4} position="relative">
//       {/* {!videoState.isRecording && videoState.isCameraActive && (
//         <Draggable>
//           <Box
//             position="absolute"
//             top="20px"
//             right="20px"
//             bg="gray.800"
//             borderRadius="md"
//             p={1}
//           >
//             <video
//               ref={videoRef}
//               autoPlay
//               style={{ width: videoState.videoBoxSize, borderRadius: "8px" }}
//             />
//           </Box>
//         </Draggable>
//       )} */}

//       <HStack spacing={8}>
//         <VStack align="stretch" justifyContent="flex-start" flex={1}>
//           <Text textAlign="left">
//             **DSA Question:** Find the missing number in an array containing
//             integers from 1 to n. One number is missing from the array. Write a
//             function to find the missing number. Example: Input: [1, 2, 4, 6, 3,
//             7, 8] Output: 5
//           </Text>
//         </VStack>
//         <Box flex={1}>
//           <VStack spacing={4} align="stretch">
//             <HStack>
//               <LanguageSelector language={language} onSelect={onSelect} />
//               <CustomSelect
//                 name="theme"
//                 value={theme}
//                 onChange={handleThemeChange}
//                 options={[
//                   { value: "vs-dark", label: "Dark Theme" },
//                   { value: "vs-light", label: "Light Theme" },
//                 ]}
//                 width="150px"
//               />
//               <CustomSelect
//                 name="fontSize"
//                 value={fontSize}
//                 onChange={handleFontSizeChange}
//                 options={[
//                   { value: 14, label: "14px" },
//                   { value: 16, label: "16px" },
//                   { value: 18, label: "18px" },
//                 ]}
//                 width="120px"
//               />
//             </HStack>
//             <Box bg="gray.800" borderRadius="md" p={4} position="relative">
//               <Editor
//                 options={{
//                   minimap: { enabled: false },
//                   fontSize: fontSize,
//                   wordWrap: "on",
//                   suggest: {
//                     showWords: true,
//                     showMethods: true,
//                     showFunctions: true,
//                   },
//                 }}
//                 height="50vh"
//                 theme={theme}
//                 language={language}
//                 defaultValue={CODE_SNIPPETS[language]}
//                 onMount={(editor) => {
//                   editorRef.current = editor;
//                   editor.focus();
//                 }}
//                 value={code}
//                 onChange={(value) => dispatch(setCode(value))}
//               />
//             </Box>
//             <Box>
//               <Output editorRef={editorRef} language={language} />
//             </Box>
//           </VStack>
//         </Box>
//       </HStack>

//       <HStack spacing={4} mt={4} flexWrap="wrap">
//         <Button
//           onClick={handleStartRecording}
//           isDisabled={videoState.isRecording || !videoState.isCameraActive}
//           colorScheme="green"
//         >
//           Start Recording
//         </Button>
//         <Button onClick={handleStopCameraAccess} colorScheme="red">
//           Stop Camera Access
//         </Button>
//       </HStack>
//       <Text mt={4}>Inactive Time: {videoState.inactiveTime} seconds</Text>
//       <Text mt={4}>Tab Changes: {videoState.tabChangeCount}</Text>
//     </Box>
//   );
// };

// export default CodeEditornew;
