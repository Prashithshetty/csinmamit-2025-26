// import { useState } from 'react';
// import { useTheme } from '../../contexts/ThemeContext';
// import GlitchText from './GlitchText';
// import GlitchTextV2 from './GlitchTextV2';
// import { Sun, Moon, Zap, Eye, EyeOff, Gauge } from 'lucide-react';

// const GlitchTextDemo = () => {
//   const { theme, toggleTheme } = useTheme();
//   const [enableShadows, setEnableShadows] = useState(true);
//   const [enableOnHover, setEnableOnHover] = useState(false);
//   const [speed, setSpeed] = useState(0.5);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             GlitchText Component Demo
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Theme-aware glitch text effect with customizable options
//           </p>
//         </div>

//         {/* Controls */}
//         <div className="max-w-4xl mx-auto mb-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//             Controls
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Theme Toggle */}
//             <div className="flex flex-col space-y-2">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Theme
//               </label>
//               <button
//                 onClick={toggleTheme}
//                 className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               >
//                 {theme === 'dark' ? (
//                   <>
//                     <Sun size={18} className="text-yellow-500" />
//                     <span className="text-gray-900 dark:text-white">Light Mode</span>
//                   </>
//                 ) : (
//                   <>
//                     <Moon size={18} className="text-gray-700" />
//                     <span className="text-gray-900 dark:text-white">Dark Mode</span>
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Shadows Toggle */}
//             <div className="flex flex-col space-y-2">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Shadows
//               </label>
//               <button
//                 onClick={() => setEnableShadows(!enableShadows)}
//                 className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               >
//                 {enableShadows ? (
//                   <>
//                     <Eye size={18} className="text-green-500" />
//                     <span className="text-gray-900 dark:text-white">Enabled</span>
//                   </>
//                 ) : (
//                   <>
//                     <EyeOff size={18} className="text-gray-500" />
//                     <span className="text-gray-900 dark:text-white">Disabled</span>
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Hover Mode Toggle */}
//             <div className="flex flex-col space-y-2">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Effect Trigger
//               </label>
//               <button
//                 onClick={() => setEnableOnHover(!enableOnHover)}
//                 className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//               >
//                 <Zap size={18} className={enableOnHover ? "text-purple-500" : "text-blue-500"} />
//                 <span className="text-gray-900 dark:text-white">
//                   {enableOnHover ? "On Hover" : "Always On"}
//                 </span>
//               </button>
//             </div>

//             {/* Speed Control */}
//             <div className="flex flex-col space-y-2">
//               <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
//                 <Gauge size={14} />
//                 <span>Speed: {speed.toFixed(1)}x</span>
//               </label>
//               <input
//                 type="range"
//                 min="0.1"
//                 max="2"
//                 step="0.1"
//                 value={speed}
//                 onChange={(e) => setSpeed(parseFloat(e.target.value))}
//                 className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Demo Sections */}
//         <div className="space-y-16">
//           {/* Version 1 - With useTheme Hook */}
//           <div className="text-center">
//             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
//               Version 1: Using useTheme Hook
//             </h3>
//             <div className="p-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
//               <GlitchText
//                 speed={speed}
//                 enableShadows={enableShadows}
//                 enableOnHover={enableOnHover}
//               >
//                 GLITCH
//               </GlitchText>
//             </div>
//             <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
//               This version uses the useTheme hook to dynamically adjust colors
//             </p>
//           </div>

//           {/* Version 2 - Pure Tailwind */}
//           <div className="text-center">
//             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
//               Version 2: Pure Tailwind Dark Mode
//             </h3>
//             <div className="p-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
//               <GlitchTextV2
//                 speed={speed}
//                 enableShadows={enableShadows}
//                 enableOnHover={enableOnHover}
//               >
//                 EFFECT
//               </GlitchTextV2>
//             </div>
//             <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
//               This version uses Tailwind's dark: modifier for theme support
//             </p>
//           </div>

//           {/* Multiple Examples */}
//           <div className="text-center">
//             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
//               Multiple Text Examples
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="p-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
//                 <GlitchTextV2
//                   speed={0.3}
//                   enableShadows={true}
//                   enableOnHover={false}
//                   className="!text-[clamp(1.5rem,5vw,3rem)]"
//                 >
//                   CYBER
//                 </GlitchTextV2>
//               </div>
//               <div className="p-8 bg-gradient-to-br from-green-100 to-cyan-100 dark:from-green-900/20 dark:to-cyan-900/20 rounded-2xl">
//                 <GlitchTextV2
//                   speed={0.7}
//                   enableShadows={true}
//                   enableOnHover={false}
//                   className="!text-[clamp(1.5rem,5vw,3rem)]"
//                 >
//                   TECH
//                 </GlitchTextV2>
//               </div>
//               <div className="p-8 bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 rounded-2xl">
//                 <GlitchTextV2
//                   speed={1.0}
//                   enableShadows={true}
//                   enableOnHover={true}
//                   className="!text-[clamp(1.5rem,5vw,3rem)]"
//                 >
//                   HOVER
//                 </GlitchTextV2>
//               </div>
//               <div className="p-8 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
//                 <GlitchTextV2
//                   speed={0.5}
//                   enableShadows={false}
//                   enableOnHover={false}
//                   className="!text-[clamp(1.5rem,5vw,3rem)]"
//                 >
//                   CLEAN
//                 </GlitchTextV2>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Usage Example */}
//         <div className="max-w-4xl mx-auto mt-16 p-6 bg-gray-900 dark:bg-gray-950 rounded-xl">
//           <h3 className="text-lg font-semibold text-white mb-4">
//             Usage Example
//           </h3>
//           <pre className="text-sm text-gray-300 overflow-x-auto">
//             <code>{`import GlitchTextV2 from './components/UI/GlitchTextV2';

// // Basic usage
// <GlitchTextV2>
//   GLITCH
// </GlitchTextV2>

// // With custom props
// <GlitchTextV2
//   speed={0.5}           // Animation speed multiplier
//   enableShadows={true}  // Enable colored shadows
//   enableOnHover={false} // Effect always on vs hover only
//   className="custom"    // Additional CSS classes
// >
//   YOUR TEXT
// </GlitchTextV2>`}</code>
//           </pre>
//         </div>

//         {/* Features */}
//         <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//             Features
//           </h3>
//           <ul className="space-y-2 text-gray-700 dark:text-gray-300">
//             <li className="flex items-start space-x-2">
//               <span className="text-green-500 mt-1">✓</span>
//               <span>Fully responsive to light/dark theme changes</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <span className="text-green-500 mt-1">✓</span>
//               <span>Smooth color transitions when switching themes</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <span className="text-green-500 mt-1">✓</span>
//               <span>Customizable animation speed</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <span className="text-green-500 mt-1">✓</span>
//               <span>Optional colored shadows (red/cyan glitch effect)</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <span className="text-green-500 mt-1">✓</span>
//               <span>Can be triggered on hover or always active</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <span className="text-green-500 mt-1">✓</span>
//               <span>Responsive text sizing with clamp()</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <span className="text-green-500 mt-1">✓</span>
//               <span>Uses Tailwind's built-in dark mode utilities</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GlitchTextDemo;
