import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to home page instead of showing placeholder
  return <Navigate to="/" replace />;
};

export default Index;