import SignUpLP from "../components/SignUpLP";
import SignUpForm from "../components/SignUpForm";

function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      <SignUpLP />
      <div className="w-3/5 bg-white flex items-center justify-center">
        <SignUpForm />
      </div>
    </div>
  );
}
export default SignUpPage;
