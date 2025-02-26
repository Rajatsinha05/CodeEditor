import React, { useState } from "react";
import { Mail, Lock, User, Code, BookOpen, CheckCircle, Hash } from "lucide-react";
import { getBranch } from "../components/data/branch";
import { getCourse } from "../components/data/course";
import axiosInstance from "../config/axiosConfig";
import { Toast, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { createStudent } from "../redux/Student/studentsSlice";
import { useDispatch } from "react-redux";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branchCode: "",
    course: "",
    grid: "",
    role: "STUDENT",
  });

  const toast = useToast();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    branchCode: "",
    grid: "",
  });
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const branchCodes = getBranch();
  const courses = getCourse();
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        }
        if (value.length < 2) {
          return "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value) {
          return "Email is required";
        }
        if (!/\S+@\S+\.\S+/.test(value)) {
          return "Please enter a valid email";
        }
        break;
      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters";
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return "Password must contain at least one lowercase letter";
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/(?=.*\d)/.test(value)) {
          return "Password must contain at least one number";
        }
        break;
      case "branchCode":
        if (!value) {
          return "Branch code is required";
        }
        break;
      case "grid":
        if (!value) return "Grid number is required";
        if (!/^\d{4}$/.test(value)) return "Must be a 4-digit number";
        break;

      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const generateOTP = async () => {
    try {
      let res = await axiosInstance.post(
        `api/otp/send?email=${formData.email}`
      );
      setGeneratedOtp(res.data.otp);
      toast({
        title: "OTP Generation Successful",
        description: "An OTP has been sent to your email address",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      setStep(2);
    } catch (error) {
      toast({
        title: "OTP Generation Failed",
        description: error.response?.data?.error || "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      vibrate();
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      branchCode: validateField("branchCode", formData.branchCode),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const navigate = useNavigate();

  const CreateStudent = async () => {
    console.log("formData: ", formData);

    try {
      await dispatch(createStudent(formData)).unwrap();
      toast({
        title: "Account created successfully!",

        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      navigate("/"); // Redirect to home after successful creation
    } catch (error) {
      toast({
        title: "Error creating account. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      if (validateForm()) {
        generateOTP();
      } else {
        vibrate();
        toast({
          title: "Invalid form details. Please check your input.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });
      }
    } else {
      if (!otp) {
        vibrate();
        toast({
          title: "Please enter the OTP.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });

        return;
      }
      if (otp === generatedOtp) {
        CreateStudent();
      } else {
        vibrate();
        toast({
          title: "Invalid OTP. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          {step === 1 ? "Create Account" : "Verify Email"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <>
              <div className="space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300"
                    size={20}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none placeholder:text-black text-black`}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none placeholder:text-black text-black`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300"
                    size={20}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none placeholder:text-black text-black`}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Hash
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300"
                    size={20}
                  />
                  <input
                    type="number"
                    name="grid"
                    value={formData.grid}
                    onChange={handleInputChange}
                    placeholder="Grid Number"
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.grid ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none placeholder:text-black text-black`}
                    inputMode="numeric"
                    pattern="\d{4}"
                    required
                  />
                  {errors.grid && (
                    <p className="text-red-500 text-sm mt-1">{errors.grid}</p>
                  )}
                </div>

                <div className="relative">
                  <Code
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300"
                    size={20}
                  />
                  <select
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.branchCode ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none appearance-none bg-white placeholder:text-black text-black`}
                    required
                  >
                    <option value="">Select Branch Code</option>
                    {branchCodes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  {errors.branchCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.branchCode}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <BookOpen
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300"
                    size={20}
                  />
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none appearance-none bg-white placeholder:text-black text-black"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-4">
                We've sent a verification code to your email address
              </p>
              <div className="relative">
                <CheckCircle
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300"
                  size={20}
                />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 outline-none placeholder:text-black text-black"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
          >
            {step === 1 ? "Continue" : "Verify & Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
