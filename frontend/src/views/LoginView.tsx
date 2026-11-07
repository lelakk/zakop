import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export const LoginView: React.FC = () => {
  const navigate = useNavigate();

  return <AuthForm mode="login" onSuccess={() => navigate("/")} />;
};
