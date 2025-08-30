// const GlitchTextV2 = ({
//   children,
//   speed = 0.5,
//   enableShadows = true,
//   enableOnHover = false,
//   className = "",
// }) => {
//   const inlineStyles = {
//     "--after-duration": `${speed * 3}s`,
//     "--before-duration": `${speed * 2}s`,
//     "--after-shadow-light": enableShadows ? "-5px 0 #dc2626" : "none", // red-600
//     "--after-shadow-dark": enableShadows ? "-5px 0 #ef4444" : "none",  // red-500
//     "--before-shadow-light": enableShadows ? "5px 0 #0891b2" : "none", // cyan-600
//     "--before-shadow-dark": enableShadows ? "5px 0 #06b6d4" : "none",  // cyan-500
//   };

//   // Base classes with dark mode support
//   const baseClasses = `
//     text-gray-900 dark:text-white 
//     text-[clamp(2rem,10vw,8rem)] 
//     font-black 
//     relative 
//     mx-auto 
//     select-none 
//     cursor-pointer
//     transition-colors
//     duration-300
//   `;

//   // Pseudo element classes using Tailwind's dark mode
//   const pseudoClasses = !enableOnHover
//     ? `
//       after:content-[attr(data-text)] 
//       after:absolute 
//       after:top-0 
//       after:left-[10px] 
//       after:text-gray-900 
//       after:dark:text-white
//       after:bg-white 
//       after:dark:bg-gray-900
//       after:overflow-hidden 
//       after:[clip-path:inset(0_0_0_0)] 
//       after:[text-shadow:var(--after-shadow-light)]
//       after:dark:[text-shadow:var(--after-shadow-dark)]
//       after:animate-glitch-after
//       after:transition-colors
//       after:duration-300
      
//       before:content-[attr(data-text)] 
//       before:absolute 
//       before:top-0 
//       before:left-[-10px] 
//       before:text-gray-900 
//       before:dark:text-white
//       before:bg-white 
//       before:dark:bg-gray-900
//       before:overflow-hidden 
//       before:[clip-path:inset(0_0_0_0)] 
//       before:[text-shadow:var(--before-shadow-light)]
//       before:dark:[text-shadow:var(--before-shadow-dark)]
//       before:animate-glitch-before
//       before:transition-colors
//       before:duration-300
//     `
//     : `
//       after:content-[''] 
//       after:absolute 
//       after:top-0 
//       after:left-[10px] 
//       after:text-gray-900 
//       after:dark:text-white
//       after:bg-white 
//       after:dark:bg-gray-900
//       after:overflow-hidden 
//       after:[clip-path:inset(0_0_0_0)] 
//       after:opacity-0
//       after:transition-all
//       after:duration-300
      
//       before:content-[''] 
//       before:absolute 
//       before:top-0 
//       before:left-[-10px] 
//       before:text-gray-900 
//       before:dark:text-white
//       before:bg-white 
//       before:dark:bg-gray-900
//       before:overflow-hidden 
//       before:[clip-path:inset(0_0_0_0)] 
//       before:opacity-0
//       before:transition-all
//       before:duration-300
      
//       hover:after:content-[attr(data-text)] 
//       hover:after:opacity-100 
//       hover:after:[text-shadow:var(--after-shadow-light)]
//       hover:after:dark:[text-shadow:var(--after-shadow-dark)]
//       hover:after:animate-glitch-after
      
//       hover:before:content-[attr(data-text)] 
//       hover:before:opacity-100 
//       hover:before:[text-shadow:var(--before-shadow-light)]
//       hover:before:dark:[text-shadow:var(--before-shadow-dark)]
//       hover:before:animate-glitch-before
//     `;

//   const combinedClasses = `${baseClasses} ${pseudoClasses} ${className}`;

//   return (
//     <div 
//       style={inlineStyles} 
//       data-text={children} 
//       className={combinedClasses}
//     >
//       {children}
//     </div>
//   );
// };

// export default GlitchTextV2;
