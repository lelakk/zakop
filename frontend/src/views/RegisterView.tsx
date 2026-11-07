import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();

  return <AuthForm mode="register" onSuccess={() => navigate("/")} />;
};
