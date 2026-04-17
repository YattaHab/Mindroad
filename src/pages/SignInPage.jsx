import LeftPanel from "../components/LeftPanel.jsx";
import SignInForm from "../components/SignInForm.jsx";

function SignInPage() {
  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <div className="w-3/5 bg-white flex items-center justify-center">
        <SignInForm />
      </div>
    </div>
  );
}
export default SignInPage;
