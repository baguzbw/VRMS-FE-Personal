import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Hide, Show, User } from 'react-iconly';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/StarSoftware.png';
import Button from '../../components/Button';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
          email,
          password,
        }
      );
      const { data } = response.data;

      if (response.status === 200 || response.status === 201) {
        Cookies.set('token', data.data.access_token, {
          secure: false,
          sameSite: 'Strict',
          expires: 1 / 2,
        });

        const user = {
          role: data.data.role,
          menu: data.data.menu,
          name: data.data.full_name,
        };
        sessionStorage.setItem('user', JSON.stringify(user));

        navigate('/dashboard');
        window.location.reload(); 
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  useEffect(() => {
    document.title = 'Login - VRMS';
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[439px] p-8 bg-white shadow-md rounded-md items-center">
        <div className="flex flex-row place-content-center mb-[50px]">
          <img src={Logo} alt="star" />
        </div>
        <h1 className="text-[24px] font-medium mb-[24px] text-center">
          Login to Your Account
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-6 relative">
            <label htmlFor="email" className="block mb-1 text-[14px]">
              Email:
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                placeholder="Enter Your Email"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <User set="two-tone" />
              </div>
            </div>
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block mb-1 text-[14px]">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-[15px] text-[14px] border border-[#BBBBBB] focus:outline-none focus:border-[#065BCC]"
                placeholder="Enter Your Password"
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <Show set="two-tone" />
                ) : (
                  <Hide set="two-tone" />
                )}
              </div>
            </div>
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="remember" className="text-[14px]">
              Remember me
            </label>
          </div>
          <Button className="bg-[#DC362E] w-full h-[48px]" type="submit">
            <span className="text-white">Login</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
