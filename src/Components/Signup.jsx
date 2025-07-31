import React, { useState } from 'react';
import { signupUser, loginUser } from '../Service/UserAPI';

const Signup = ({ isLogin, setIsLogin, setIsOpenLog, login }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || (!isLogin && !name)) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // LOGIN FLOW
        const response = await loginUser({ number: phone });
        if (response.message === 'login successfully') {
          login(response.user); // Save user in context
          setIsOpenLog(false);
        } else {
          alert(response.message);
        }
      } else {
        // SIGNUP FLOW
        const response = await signupUser({name: name, number: phone });

        if (response.message === 'User Created') {
          login(response.user); // Save new user
          setIsOpenLog(false);
        } else if (response.message === 'You already Exist') {
          alert('Account already exists. Please login.');
          setIsLogin(true);
        } else {
          alert(response.message || 'Signup failed.');
        }
      }
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        {/* Auth Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          )}

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <button onClick={() => setIsLogin(false)} className="text-blue-600 underline">
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="text-blue-600 underline">
                Login
              </button>
            </>
          )}
        </p>

        <button
          onClick={() => setIsOpenLog(false)}
          className="absolute top-4 right-4 text-black text-2xl hover:text-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Signup;
